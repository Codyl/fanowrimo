export interface Post {
  id: string;
  title: string;
  description: string;
  imagePath?: string;
  creator: string;
  goal: number;
  wordCount: {count: number, date: string}[];
}
