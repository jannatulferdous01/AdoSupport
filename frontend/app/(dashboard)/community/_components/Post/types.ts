export interface PostProps {
  id: string;
  author: {
    id: string;
    name: string;
    image: string;
    isExpert?: boolean;
    role?: string;
  };
  content: {
    text: string;
    title?: string;
    image?: string;
  };
  category: "question" | "story" | "resource" | "general";
  createdAt: Date;
  commentCount: number;
  reactions: {
    likes: number;
    helpful: number;
    support: number;
  };
  tags: string[];
}