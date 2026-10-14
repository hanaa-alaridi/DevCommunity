import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Bookmark from "@/models/Bookmark";
import Post from "@/models/Post";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to bookmark posts." },
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
    await Bookmark.findOneAndUpdate(
      { user: session.user.id, post: id },
      { user: session.user.id, post: id },
      { upsert: true, new:true }
    );
    return NextResponse.json(
      { message: "Post saved to bookmarks!" },
      { status: 200 }
    );
  } 
  catch (error) {
    console.error("Error bookmarking post:", error);
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
    await connectToDatabase();
    await Bookmark.findOneAndDelete({
      user: session.user.id,
      post: id
    });
    return NextResponse.json(
      { message: "Post removed from bookmarks!" },
      { status: 200 }
    );
  } 
  catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}