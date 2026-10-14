import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signIn");
  }
  await connectToDatabase();
  const user = await User.findOne({$or: [
    session.user.id ? { _id: session.user.id } : null,
    session.user.email ? { email: session.user.email } : null,
  ].filter(Boolean) as any[]}).select("-password").lean();
  if (!user) {
    redirect("/signIn");
  }
  const safeUsername = user.username || (session.user as any).username || "developer";
  const safeDisplayName = user.name && user.name.trim() !== "" ? user.name : safeUsername;
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-zinc-100">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Update your public profile, bio, tech stack, and personal details.
        </p>
      </div>
      <SettingsForm initialUser={{username: user.name || "", bio: user.bio || "", skills: Array.isArray(user.skills) ? user.skills.join(", ") : "", image: user.image || ""}}/>
    </div>
  );
}