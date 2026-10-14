import { connectToDatabase } from "@/lib/db";
import Community from "@/models/Community";
import Post from "@/models/Post";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CreateCommunityPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/signIn");
  }
  await connectToDatabase();
  const communityTopics = await Community.distinct("topics");
  const postTopics = await Post.distinct("topics");
  const availableTopics = Array.from(
    new Set([...communityTopics, ...postTopics])
  );
  return <CreateCommunityForm availableTopics={availableTopics} />;
}