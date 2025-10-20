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
  summary?: string; // AI-generated summary of the content
};

export type AITheme = {
  id: string;
  name: string;
  backgroundImageUrl?: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  sources: FileInfo[];
  aiTheme?: AITheme;
  createdAt: number;
  updatedAt: number;
};
