export type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

export type FileInfo = {
  name: string;
  content: string;
  type: 'file' | 'url';
  source: string;
};
