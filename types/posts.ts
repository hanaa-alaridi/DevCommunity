export interface CommunityOption {
  _id: string;
  name: string;
}

export interface PostData {
  _id: string;
  title: string;
  content: string;
  community: string;
  topics: string[];
  slug: string;
}

export interface EditPostFormProps {
  post: PostData;
  communities: CommunityOption[];
  availableTopics: string[];
}

export interface DeletePostButtonProps {
  postId: string;
}

export interface GetPostsFilters {
  search?: string;
  communityId?: string;
  topic?: string;
  authorId?: string;
  sort?: "newest" | "oldest" | "popular";
  page?: number;
  limit?: number;
}

export interface CommunityOption {
  _id: string;
  name: string;
  topics?: string[];
}

export interface CreatePostFormProps {
  communities: CommunityOption[];
  availableTopics: string[];
}