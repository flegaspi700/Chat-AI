import type { Message } from '@/lib/types';

export const mockUserMessage: Message = {
  id: 'msg-user-1',
  role: 'user',
  content: 'What is artificial intelligence?',
};

export const mockAIMessage: Message = {
  id: 'msg-ai-1',
  role: 'ai',
  content: 'Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.',
};

export const mockConversation: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'When was the term AI coined?',
  },
  {
    id: 'msg-2',
    role: 'ai',
    content: 'The term "artificial intelligence" was coined by John McCarthy in 1956 at the Dartmouth Conference.',
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'Who proposed the Turing Test?',
  },
  {
    id: 'msg-4',
    role: 'ai',
    content: 'Alan Turing proposed the Turing Test in 1950 as a measure of machine intelligence.',
  },
];

export const mockAIResponses = {
  simpleQuestion: 'This is a simple AI response.',
  complexQuestion: 'This is a more detailed AI response that synthesizes information from multiple sources and provides a comprehensive answer.',
  errorResponse: 'I apologize, but I encountered an error processing your request.',
  noSourcesResponse: 'Please upload files or add URLs to provide context for your questions.',
};

export const mockAIResponseWithSources = {
  response: 'Based on the uploaded documents, here is the answer...',
  sources: ['sample-article.txt', 'company-policies.txt'],
};
