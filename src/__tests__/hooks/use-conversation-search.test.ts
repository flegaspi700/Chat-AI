import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useConversationSearch } from '@/hooks/use-conversation-search';
import type { Conversation } from '@/lib/types';

describe('useConversationSearch', () => {
  const mockConversations: Conversation[] = [
    {
      id: '1',
      title: 'React Testing Best Practices',
      messages: [
        { id: 'm1', role: 'user', content: 'How to test React components?' },
        { id: 'm2', role: 'ai', content: 'Use React Testing Library with Jest' },
      ],
      sources: [],
      createdAt: Date.now() - 86400000, // 1 day ago
      updatedAt: Date.now() - 86400000,
    },
    {
      id: '2',
      title: 'TypeScript Advanced Patterns',
      messages: [
        { id: 'm3', role: 'user', content: 'What are discriminated unions?' },
        { id: 'm4', role: 'ai', content: 'Discriminated unions use a literal type...' },
      ],
      sources: [],
      createdAt: Date.now() - 172800000, // 2 days ago
      updatedAt: Date.now() - 172800000,
    },
    {
      id: '3',
      title: 'Next.js Performance Tips',
      messages: [
        { id: 'm5', role: 'user', content: 'How to optimize Next.js apps?' },
        { id: 'm6', role: 'ai', content: 'Use dynamic imports and React Server Components' },
      ],
      sources: [],
      createdAt: Date.now() - 259200000, // 3 days ago
      updatedAt: Date.now() - 259200000,
    },
  ];

  describe('initial state', () => {
    it('should return all conversations when no search query', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      expect(result.current.filteredConversations).toEqual(mockConversations);
      expect(result.current.searchQuery).toBe('');
      expect(result.current.hasResults).toBe(true);
    });
  });

  describe('search by title', () => {
    it('should filter conversations by title (case-insensitive)', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('Testing Best');
      });

      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].title).toBe('React Testing Best Practices');
      expect(result.current.hasResults).toBe(true);
    });

    it('should handle partial title matches', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('pattern');
      });

      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].title).toBe('TypeScript Advanced Patterns');
    });

    it('should be case-insensitive', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('NEXT.JS');
      });

      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].title).toBe('Next.js Performance Tips');
    });
  });

  describe('search by message content', () => {
    it('should filter conversations by message content', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('Server Components');
      });

      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].title).toBe('Next.js Performance Tips');
    });

    it('should search in both user and AI messages', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      // Search for user message content
      act(() => {
        result.current.setSearchQuery('discriminated unions');
      });

      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].title).toBe('TypeScript Advanced Patterns');

      // Search for AI message content
      act(() => {
        result.current.setSearchQuery('Testing Library');
      });

      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].title).toBe('React Testing Best Practices');
    });
  });

  describe('multiple matches', () => {
    it('should return all matching conversations', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('how to');
      });

      // All conversations have "how to" in user messages
      expect(result.current.filteredConversations).toHaveLength(2);
    });
  });

  describe('no results', () => {
    it('should return empty array when no matches found', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('quantum physics');
      });

      expect(result.current.filteredConversations).toHaveLength(0);
      expect(result.current.hasResults).toBe(false);
    });

    it('should handle empty search query by returning all conversations', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('Testing Best');
      });

      expect(result.current.filteredConversations).toHaveLength(1);

      // Clear search
      act(() => {
        result.current.setSearchQuery('');
      });

      expect(result.current.filteredConversations).toEqual(mockConversations);
      expect(result.current.hasResults).toBe(true);
    });
  });

  describe('search query trimming', () => {
    it('should trim whitespace from search query', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('  Testing Best  ');
      });

      expect(result.current.searchQuery).toBe('  Testing Best  '); // Store original
      expect(result.current.filteredConversations).toHaveLength(1);
    });
  });

  describe('empty conversations list', () => {
    it('should handle empty conversations array', () => {
      const { result } = renderHook(() => useConversationSearch([]));

      expect(result.current.filteredConversations).toEqual([]);
      expect(result.current.hasResults).toBe(false);

      act(() => {
        result.current.setSearchQuery('anything');
      });

      expect(result.current.filteredConversations).toEqual([]);
      expect(result.current.hasResults).toBe(false);
    });
  });

  describe('clear search', () => {
    it('should provide a clearSearch function', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('Testing Best');
      });

      expect(result.current.filteredConversations).toHaveLength(1);

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.filteredConversations).toEqual(mockConversations);
    });
  });
});
