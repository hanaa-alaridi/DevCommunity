export interface LikeButtonProps {
  postId?: string;
  endpoint?: string;
  initialLikesCount: number;
  initialHasLiked: boolean;
  isLoggedIn: boolean;
}