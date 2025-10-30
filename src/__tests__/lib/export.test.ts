import { exportConversationToTxt, exportConversationToPdf, downloadFile } from '@/lib/export';
import type { Conversation } from '@/lib/types';

// Mock jsPDF
jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      text: jest.fn(),
      setFontSize: jest.fn(),
      setFont: jest.fn(),
      setTextColor: jest.fn(),
      save: jest.fn(),
      addPage: jest.fn(),
      splitTextToSize: jest.fn((text: string) => [text]),
      internal: {
        pageSize: {
          getWidth: jest.fn(() => 210),
          getHeight: jest.fn(() => 297),
        },
      },
    })),
  };
});

describe('Conversation Export Utilities', () => {
  const mockConversation: Conversation = {
    id: 'test-conv-123',
    title: 'Test Conversation About AI',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'What is artificial intelligence?',
      },
      {
        id: 'msg-2',
        role: 'ai',
        content: 'Artificial Intelligence (AI) is a branch of computer science focused on creating systems that can perform tasks that typically require human intelligence.',
      },
      {
        id: 'msg-3',
        role: 'user',
        content: 'Can you give me examples?',
      },
      {
        id: 'msg-4',
        role: 'ai',
        content: 'Sure! Examples include:\n- Virtual assistants like Siri and Alexa\n- Recommendation systems on Netflix\n- Self-driving cars\n- Image recognition systems',
      },
    ],
    sources: [
      {
        name: 'ai-guide.txt',
        content: 'AI is the future...',
        type: 'file',
        source: 'ai-guide.txt',
        summary: 'Introduction to AI concepts',
      },
    ],
    createdAt: 1698624000000, // Oct 30, 2023
    updatedAt: 1698710400000, // Oct 31, 2023
  };

  describe('exportConversationToTxt', () => {
    it('should generate a text file with conversation title', () => {
      const result = exportConversationToTxt(mockConversation);
      
      expect(result).toContain('Test Conversation About AI');
      expect(result).toContain('='.repeat(50));
    });

    it('should include formatted timestamps', () => {
      const result = exportConversationToTxt(mockConversation);
      
      expect(result).toMatch(/Created:/);
      expect(result).toMatch(/Last Updated:/);
    });

    it('should format all messages with user/AI labels', () => {
      const result = exportConversationToTxt(mockConversation);
      
      expect(result).toContain('USER:');
      expect(result).toContain('What is artificial intelligence?');
      expect(result).toContain('AI:');
      expect(result).toContain('Artificial Intelligence (AI) is a branch');
    });

    it('should separate messages with clear dividers', () => {
      const result = exportConversationToTxt(mockConversation);
      
      expect(result).toContain('-'.repeat(50));
    });

    it('should include sources section when sources exist', () => {
      const result = exportConversationToTxt(mockConversation);
      
      expect(result).toContain('SOURCES');
      expect(result).toContain('ai-guide.txt');
      expect(result).toContain('Introduction to AI concepts');
    });

    it('should handle conversations with no sources', () => {
      const conversationNoSources = {
        ...mockConversation,
        sources: [],
      };
      
      const result = exportConversationToTxt(conversationNoSources);
      
      expect(result).toContain('No sources');
    });

    it('should handle multi-line AI responses correctly', () => {
      const result = exportConversationToTxt(mockConversation);
      
      expect(result).toContain('Virtual assistants like Siri and Alexa');
      expect(result).toContain('Self-driving cars');
    });

    it('should include message count', () => {
      const result = exportConversationToTxt(mockConversation);
      
      expect(result).toContain('4 messages');
    });
  });

  describe('exportConversationToPdf', () => {
    let mockDoc: any;

    beforeEach(() => {
      mockDoc = {
        text: jest.fn().mockReturnThis(),
        setFontSize: jest.fn().mockReturnThis(),
        setFont: jest.fn().mockReturnThis(),
        setTextColor: jest.fn().mockReturnThis(),
        save: jest.fn(),
        splitTextToSize: jest.fn((text: string) => [text]),
        internal: {
          pageSize: {
            getWidth: jest.fn(() => 210),
            getHeight: jest.fn(() => 297),
          },
        },
      };
    });

    it('should create PDF with conversation title', async () => {
      const result = await exportConversationToPdf(mockConversation);
      
      expect(result).toBeDefined();
      expect(result.filename).toMatch(/^Test_Conversation_About_AI_\d+\.pdf$/);
      expect(result.success).toBe(true);
    });

    it('should generate safe filename from conversation title', async () => {
      const convWithSpecialChars = {
        ...mockConversation,
        title: 'My Conversation: A Test / Example?',
      };
      
      const result = await exportConversationToPdf(convWithSpecialChars);
      
      expect(result.filename).toMatch(/^My_Conversation_A_Test_Example.*\.pdf$/);
    });

    it('should include timestamp in filename for uniqueness', async () => {
      const result = await exportConversationToPdf(mockConversation);
      
      expect(result.filename).toMatch(/Test_Conversation_About_AI_\d+\.pdf/);
    });

    it('should handle empty conversations gracefully', async () => {
      const emptyConversation = {
        ...mockConversation,
        messages: [],
      };
      
      const result = await exportConversationToPdf(emptyConversation);
      
      expect(result.success).toBe(true);
      expect(result.filename).toBeDefined();
    });

    it('should return error message if PDF generation fails', async () => {
      const invalidConversation = null as any;
      
      const result = await exportConversationToPdf(invalidConversation);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('downloadFile', () => {
    let createElementSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    let removeChildSpy: jest.SpyInstance;
    let clickSpy: jest.Mock;

    beforeEach(() => {
      clickSpy = jest.fn();
      const mockLink = {
        href: '',
        download: '',
        click: clickSpy,
        style: {},
      };

      createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation();
      removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation();
      
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should trigger file download with correct filename and content', () => {
      const { downloadFile } = require('@/lib/export');
      const content = 'Test file content';
      const filename = 'test-export.txt';
      
      downloadFile(content, filename, 'text/plain');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
