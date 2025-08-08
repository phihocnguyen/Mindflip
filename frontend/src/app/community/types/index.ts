export interface Author {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  author: Author;
  content: string;
  createdAt: string;
  likes: string[];
  parentCommentId?: string | null;
  replyCount: number;
  replyToUser?: {
    _id: string;
    name: string;
  } | null;
}

export interface Post {
  _id: string;
  author: Author;
  content: string;
  category: string;
  likes: string[];
  commentCount: number;
  createdAt: string;
}