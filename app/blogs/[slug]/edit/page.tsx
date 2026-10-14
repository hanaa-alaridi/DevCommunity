import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import Community from "@/models/Community";
import EditPostForm from "@/components/EditPostForm";

export default async function EditPostPage({params} : {params: Promise<{ slug: string }>;}) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/signIn");
  }
  const { slug } = await params;
  await connectToDatabase();
  const rawPost = await Post.findOne({ slug }).lean();
  if (!rawPost) {
    notFound();
  }
  if (rawPost.author.toString() !== session.user.id) {
    redirect("/dashboard");
  }
  const rawCommunities = await Community.find({}).select("name _id topics").lean();
  const communities = rawCommunities.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
  }));
  const communityTopics = rawCommunities.flatMap((c: any) => c.topics || []);
  const postTopics = await Post.distinct("topics");
  const availableTopics = Array.from(
    new Set([...communityTopics, ...postTopics, ...rawPost.topics])
  );
  const post = {
    _id: rawPost._id.toString(),
    title: rawPost.title,
    content: rawPost.content,
    community: rawPost.community.toString(),
    topics: rawPost.topics || [],
    slug: rawPost.slug,
  };
  return (
    <EditPostForm post={post} communities={communities} availableTopics={availableTopics}/>
  );
}