import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Community from "@/models/Community";
import DashboardClient from "@/components/DashboardClient";
import Bookmark from "@/models/Bookmark";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signIn");
  }
  await connectToDatabase();
  const currentUser = await User.findOne({
    $or: [session.user.id ? { _id: session.user.id } : null, session.user.email ? { email: session.user.email } : null, (session.user as any).username ? { username: (session.user as any).username } : null].filter(Boolean) as any[],
  }).lean();
  if (!currentUser) {
    redirect("/signIn");
  }
  const userId = currentUser._id;
  const userBookmarks = await Bookmark.find({ user: userId }).select("post").lean();
    const bookmarkedPostIds = userBookmarks.map((b: any) => b.post);
    const [posts, postsWithUserComments, communities, bookmarkedPosts] = await Promise.all([
      Post.find({ author: userId }).populate("community", "name slug").sort({ createdAt: -1 }).lean(),
      Post.find({ "comments.author": userId }, { title: 1, slug: 1, comments: 1 }).lean(),
      Community.find({$or: [{ creator: userId }, { members: userId }]}).sort({ createdAt: -1 }).lean(),
      bookmarkedPostIds.length > 0 ? Post.find({ _id: { $in: bookmarkedPostIds } }).populate("author", "username image").populate("community", "name slug").sort({ createdAt: -1 }).lean() : [],
    ]);
  const comments = postsWithUserComments.flatMap((p: any) => (
    p.comments || []).filter((c: any) => {
      const commentAuthorId = c.author?._id?.toString() || c.author?.toString();
        return commentAuthorId === userId.toString();
      }).map((c: any) => {
        const commentLikes = Array.isArray(c.likes) ? c.likes.filter(Boolean).map((id: any) =>(
          id._id ? id._id.toString() : id.toString())) : [];
          return {...c, _id: c._id?.toString() || c._id, likesCount: commentLikes.length, hasLiked: Boolean(userId && commentLikes.includes(userId.toString())), postId: {_id: p._id.toString(), title: p.title, slug: p.slug}};
      })
  );
  const totalLikes = posts.reduce((acc, post: any) => acc + (Array.isArray(post.likes) ? post.likes.length : 0), 0);
  const createdCommunities = communities.filter((c: any) => {
      const creatorId = c.creator?._id?.toString() || c.creator?.toString();
      return creatorId === userId.toString();
  });
  const joinedCommunities = communities.filter((c: any) => {
    const creatorId = c.creator?._id?.toString() || c.creator?.toString();
    return creatorId !== userId.toString();
  });
  const serializedUser = {
    username: currentUser.username || (session.user as any).username || "developer",
    name: currentUser.name || currentUser.username || "Developer",
    image: currentUser.image || session.user.image || "",
  };
  return (
    <DashboardClient user={serializedUser} stats={{totalPosts: posts.length, totalComments: comments.length, totalCreatedCommunities: createdCommunities.length, totalJoinedCommunities: joinedCommunities.length, totalLikes}} initialPosts={JSON.parse(JSON.stringify(posts))} initialComments={JSON.parse(JSON.stringify(comments))} initialCreatedCommunities={JSON.parse(JSON.stringify(createdCommunities))} initialJoinedCommunities={JSON.parse(JSON.stringify(joinedCommunities))} initialBookmarks={JSON.parse(JSON.stringify(bookmarkedPosts))}/>
  );
}