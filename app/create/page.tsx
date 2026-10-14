import { connectToDatabase } from "@/lib/db";
import Community from "@/models/Community";
import Post from "@/models/Post";
import CreatePostForm from "@/components/CreatePostForm";

export const dynamic = "force-dynamic";

export default async function CreatePage() {
  await connectToDatabase();
  const rawCommunities = await Community.find({}).select("name _id topics").lean();
  const communities = rawCommunities.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
    topics: c.topics || [],
  }));
  const communityTopics = rawCommunities.flatMap((c: any) => c.topics || []);
  const postTopics = await Post.distinct("topics");
  const availableTopics = Array.from(
    new Set([...communityTopics, ...postTopics])
  );
  return (
    <CreatePostForm communities={communities} availableTopics={availableTopics}/>
  );
}
