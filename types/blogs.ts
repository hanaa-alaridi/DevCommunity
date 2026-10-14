export interface BlogsPageProps {
  searchParams: Promise<{
    query?: string;
    search?: string;
    topic?: string;
    community?: string;
    sort?: "newest" | "oldest" | "popular";
    page?: string;
  }>;
}

export interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}