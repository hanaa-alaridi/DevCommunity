export interface CommentAuthor {
  _id?: string;
  username?: string;
  image?: string;
}

export interface CommentItem {
  _id: string;
  author: CommentAuthor | string;
  content: string;
  createdAt: string;
  likesCount?: number;
  hasLiked?: boolean;
}

export interface CommentSectionProps {
  postId: string;
  postAuthorId?: string;
  comments: CommentItem[];
  currentUserId?: string;
  isLoggedIn: boolean;
}