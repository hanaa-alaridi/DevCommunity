import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: Request, { params }: { params: Promise<{ id: string; commentId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: postId, commentId } = await params;
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
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
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (!Array.isArray(comment.likes)) {
      comment.likes = [];
    }
    const userIdStr = user._id.toString();
    const likesArray = comment.likes.map((id: any) => id.toString());
    const hasLiked = likesArray.includes(userIdStr);
    if (hasLiked) {
      comment.likes = comment.likes.filter(
        (id: any) => id.toString() !== userIdStr
      );
    } 
    else {
      comment.likes.push(user._id);
    }
    await post.save();
    return NextResponse.json({
      success: true,
      liked: !hasLiked,
      likesCount: comment.likes.length,
    });
  } 
  catch (error: any) {
    console.error("Comment like route error:", error);
    return NextResponse.json({ error: error.message || "Failed to toggle comment like" }, { status: 500 }
    );
  }
}