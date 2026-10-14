import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email && !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { username, bio, skills, image } = body;
    await connectToDatabase();
    const queryConditions = [];
    if (session.user.id) queryConditions.push({ _id: session.user.id });
    if (session.user.email) queryConditions.push({ email: session.user.email });
    const currentUser = await User.findOne({ $or: queryConditions });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (username && username.trim().toLowerCase() !== currentUser.username?.toLowerCase()) {
      const cleanUsername = username.trim();
      const existingUser = await User.findOne({
        username: { $regex: new RegExp(`^${cleanUsername}$`, "i") },
        _id: { $ne: currentUser._id },
      });
      if (existingUser) {
        return NextResponse.json({error: "This username is already taken by another developer."}, { status: 400 });
      }
      currentUser.username = cleanUsername;
    }
    const skillsArray = typeof skills === "string" ? skills.split(",").map((s: string) => s.trim()).filter(Boolean) : Array.isArray(skills) ? skills : [];
    currentUser.bio = bio || "";
    currentUser.skills = skillsArray;
    currentUser.image = image || "";
    await currentUser.save();
    return NextResponse.json({ success: true, user: currentUser });
  } 
  catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}