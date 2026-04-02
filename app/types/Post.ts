export interface Reply {
  _id: string;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  text: string;
  likes: string[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  text: string;
  likes: string[];
  replies: Reply[];
  createdAt: string;
}

export interface PostDoc {
  _id: string;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  text: string;
  images: { url: string; publicId: string }[];
  privacy: 'public' | 'private';
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}
