import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Community from "@/models/Community";

export async function POST(req: Request, { params } : { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to join communities." },
        { status: 401 }
      );
    }
    const { id } = await params;
    await connectToDatabase();
    const community = await Community.findById(id);
    if (!community) {
      return NextResponse.json(
        { message: "Community not found." },
        { status: 404 }
      );
    }
    await Community.findByIdAndUpdate(id, {
      $addToSet: { members: session.user.id },
    });
    return NextResponse.json(
      { message: "Successfully joined community!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining community:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params } : { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to leave communities." },
        { status: 401 }
      );
    }
    const { id } = await params;
    await connectToDatabase();
    const community = await Community.findById(id);
    if (!community) {
      return NextResponse.json(
        { message: "Community not found." },
        { status: 404 }
      );
    }
    await Community.findByIdAndUpdate(id, {
      $pull: { members: session.user.id },
    });
    return NextResponse.json(
      { message: "Successfully left community!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error leaving community:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}