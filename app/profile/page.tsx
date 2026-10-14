import { auth } from "@/auth"; 
import { redirect } from "next/navigation";

export default async function OwnProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signIn");
  }
  const username =
    session.user.username ||
    session.user.name?.toLowerCase().replace(/\s+/g, "");
  if (username) {
    redirect(`/profile/${username}`);
  }
  redirect("/dashboard");
}