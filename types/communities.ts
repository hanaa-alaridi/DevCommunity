export interface CommunitiesPageProps {
  searchParams: Promise<{search?: string; query?: string;}>;
}

export interface CommunityPageProps {
  params: Promise<{ slug: string; }>;
}

export interface CreateCommunityFormProps {
  availableTopics: string[];
}

export interface JoinCommunityButtonProps {
  communityId: string;
  initialIsMember: boolean;
  isLoggedIn: boolean;
}