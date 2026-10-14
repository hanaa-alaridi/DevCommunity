import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { postSchema } from "@/schemas/postSchema";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to create a post." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const validation = postSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    const { title, content, community, topics } = validation.data;
    await connectToDatabase();
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const newPost = await Post.create({
      title,
      slug,
      content,
      community,
      topics,
      author: session.user.id,
    });
    return NextResponse.json(
      { message: "Post created successfully!", post: newPost },
      { status: 201 }
    );
  } 
  catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Internal server error. Failed to create post." },
      { status: 500 }
    );
  }
}