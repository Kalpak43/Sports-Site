export interface PostData {
  media: string[];
  tags: string[];
  caption: string | null;
  likes: number;
  comments: number;
  uid?: string;
}
