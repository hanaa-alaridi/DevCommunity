import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: postId } = await params;
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid Post ID format" }, { status: 400 });
    }
    await connectToDatabase();
    const userConditions = [
      session.user.id ? { _id: session.user.id } : null,
      session.user.email ? { email: session.user.email } : null,
    ].filter(Boolean) as any[];
    if (userConditions.length === 0) {
      return NextResponse.json({ error: "User session incomplete" }, { status: 400 });
    }
    const user = await User.findOne({ $or: userConditions });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const userIdStr = user._id.toString();
    const likesArray = Array.isArray(post.likes) ? post.likes.map((id: any) => id.toString()) : [];
    const hasLiked = likesArray.includes(userIdStr);
    const updatedPost = await Post.findByIdAndUpdate( postId, hasLiked ? { $pull: { likes: user._id } } : { $addToSet: { likes: user._id } }, { new: true });
    const updatedLikes = Array.isArray(updatedPost?.likes) ? updatedPost.likes : [];
    return NextResponse.json({
      success: true,
      liked: !hasLiked,
      likesCount: updatedLikes.length,
    });
  } 
  catch (error: any) {
    console.error("Post like error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to toggle post like" },
      { status: 500 }
    );
  }
}