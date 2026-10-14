import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Community from "@/models/Community";
import { communitySchema } from "@/schemas/communitySchema";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to create a community." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const validation = communitySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    const { name, description, topics } = validation.data;
    await connectToDatabase();
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    const existingCommunity = await Community.findOne({ slug });
    if (existingCommunity) {
      return NextResponse.json(
        { message: "A community with this name already exists." },
        { status: 400 }
      );
    }
    const newCommunity = await Community.create({
      name,
      slug,
      description,
      topics,
      creator: session.user.id,
      members: [session.user.id],
    });
    return NextResponse.json(
      { message: "Community created successfully!", community: newCommunity },
      { status: 201 }
    );
  } 
  catch (error) {
    console.error("Error creating community:", error);
    return NextResponse.json(
      { message: "Internal server error. Failed to create community." },
      { status: 500 }
    );
  }
}