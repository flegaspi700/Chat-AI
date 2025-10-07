import { getAIResponse, scrapeUrl } from '@/app/actions';

// Mock the AI flows with inline data to avoid initialization issues
jest.mock('@/ai/flows/generate-chatbot-response', () => ({
  generateChatbotResponse: jest.fn().mockResolvedValue({
    response: 'This is a test AI response about artificial intelligence.',
  }),
}));

jest.mock('@/ai/flows/scrape-website', () => ({
  scrapeWebsite: jest.fn().mockResolvedValue({
    title: 'Test Article',
    content: 'This is test scraped content from a website.',
    url: 'https://example.com',
  }),
}));

describe('Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAIResponse', () => {
    it('returns AI response for valid input', async () => {
      const result = await getAIResponse('What is AI?', undefined);
      
      expect(result.response).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('returns error for empty input', async () => {
      const result = await getAIResponse('', undefined);
      
      expect(result.error).toBe('User input is empty.');
      expect(result.response).toBeUndefined();
    });

    it('includes file content in AI request', async () => {
      const fileContent = 'Test file content';
      const result = await getAIResponse('Question?', fileContent);
      
      expect(result.response).toBeDefined();
    });

    it('handles AI errors gracefully', async () => {
      const { generateChatbotResponse } = require('@/ai/flows/generate-chatbot-response');
      generateChatbotResponse.mockRejectedValueOnce(new Error('AI Error'));
      
      const result = await getAIResponse('Question?', undefined);
      
      expect(result.error).toBe('Failed to get response from AI. Please try again.');
    });
  });

  describe('scrapeUrl', () => {
    it('scrapes valid URL successfully', async () => {
      const result = await scrapeUrl('http://quotes.toscrape.com/');
      
      expect(result.title).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('returns error for empty URL', async () => {
      const result = await scrapeUrl('');
      
      expect(result.error).toBe('URL is empty.');
    });

    it('handles scraping errors', async () => {
      const { scrapeWebsite } = require('@/ai/flows/scrape-website');
      scrapeWebsite.mockRejectedValueOnce(new Error('Network error'));
      
      const result = await scrapeUrl('http://example.com');
      
      expect(result.error).toContain('Failed to scrape content');
    });
  });
});
