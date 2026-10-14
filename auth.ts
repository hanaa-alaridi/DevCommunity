import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/schemas/loginSchema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;
        const { email, password } = validated.data;
        await connectToDatabase();
        const user = await User.findOne({ email });
        if (!user || !user.password) return null;
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          image: user.image || "",
        };
      }
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    async signIn({ user, profile, account }) {
      if (account?.provider !== "credentials" && user?.email) {   
        try {
          await connectToDatabase();
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const baseUsername =
              (profile as any)?.login ||
              user.email?.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "") ||
              "dev";
            await User.create({
              email: user.email,
              image: user.image || "",
              username: baseUsername.toLowerCase(),
              skills: [],
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving user during sign-in:", error);
          return true;
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.username = dbUser.username;
          }
        } catch (error) {
          console.error("Error attaching user to session:", error);
        }
      }
      return session;
    },
  },
});