export type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

export type FileInfo = {
  name: string;
  content: string;
} | null;
