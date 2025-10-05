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

export type AITheme = {
  id: string;
  name: string;
  imageHint: string;
};
