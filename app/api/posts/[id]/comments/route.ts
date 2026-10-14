import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to comment." },
        { status: 401 }
      );
    }
    const { id } = await params;
    const body = await req.json();
    const result = commentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0]?.message || "Invalid comment data." },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found." },
        { status: 404 }
      );
    }
    const newComment = {
      author: session.user.id,
      content: result.data.content,
      createdAt: new Date(),
    };
    post.comments.push(newComment);
    await post.save();
    return NextResponse.json(
      { message: "Comment added successfully!", comment: newComment },
      { status: 201 }
    );
  } 
  catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json(
        { message: "Comment ID is required." },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found." },
        { status: 404 }
      );
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found." },
        { status: 404 }
      );
    }
    const isCommentAuthor = comment.author.toString() === session.user.id;
    const isPostAuthor = post.author.toString() === session.user.id;
    if (!isCommentAuthor && !isPostAuthor) {
      return NextResponse.json(
        { message: "Forbidden. You cannot delete this comment." },
        { status: 403 }
      );
    }
    post.comments.pull({ _id: commentId });
    await post.save();
    return NextResponse.json(
      { message: "Comment deleted successfully!" },
      { status: 200 }
    );
  } 
  catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}