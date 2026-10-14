export interface DashboardClientProps {
  user: {
    username: string;
    name: string;
    image: string;
  };
  stats: {
    totalPosts: number;
    totalComments: number;
    totalCreatedCommunities: number;
    totalJoinedCommunities: number;
    totalLikes: number;
  };
  initialPosts: any[];
  initialComments: any[];
  initialCreatedCommunities: any[];
  initialJoinedCommunities: any[];
  initialBookmarks: any[];
}