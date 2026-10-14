import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { postSchema } from "@/schemas/postSchema";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to update a post." },
        { status: 401 }
      );
    }
    const { id } = await params;
    const body = await req.json();
    const validation = postSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0]?.message || "Validation failed" },
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
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden. You can only edit posts that you created." },
        { status: 403 }
      );
    }
    const updates = validation.data;
    if (updates.title && updates.title !== post.title) {
      const baseSlug = updates.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      post.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }
    Object.assign(post, updates);
    await post.save();
    return NextResponse.json(
      { message: "Post updated successfully!", post },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { message: "Internal server error. Failed to update post." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to delete a post." },
        { status: 401 }
      );
    }
    const { id } = await params;
    await connectToDatabase();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found." },
        { status: 404 }
      );
    }
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden. You can only delete posts that you created." },
        { status: 403 }
      );
    }
    await Post.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Post deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Internal server error. Failed to delete post." },
      { status: 500 }
    );
  }
}