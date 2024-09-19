interface PostData {
  id?: string;
  createdAt: Date;
  media: string[];
  tags: string[];
  caption: string | null;
  likes: number;
  comments: number;
  liked?: boolean;
  uid?: string;
  userProfile?: string | null;
  userHandle?: string;
}
