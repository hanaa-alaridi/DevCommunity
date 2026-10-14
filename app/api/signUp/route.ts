import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { userProfileSchema } from "@/schemas/userSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = userProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    const { username, email, password } = validation.data;
    await connectToDatabase();
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });
    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { message: "An account with this email already exists." },
          { status: 400 }
        );
      }
      if (existingUser.username === username.toLowerCase()) {
        return NextResponse.json(
          { message: "This username is already taken." },
          { status: 400 }
        );
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      image: "",
      skills: [],
    });
    return NextResponse.json(
      { message: "User registered successfully!", userId: newUser._id },
      { status: 201 }
    );
  } 
  catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}