import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useConversationSearch, type ConversationFilters } from '@/hooks/use-conversation-search';
import type { Conversation } from '@/lib/types';

describe('useConversationSearch', () => {
  const now = Date.now();
  const oneDayAgo = now - 86400000; // 1 day
  const twoDaysAgo = now - 172800000; // 2 days
  const threeDaysAgo = now - 259200000; // 3 days
  const eightDaysAgo = now - 691200000; // 8 days
  const thirtyDaysAgo = now - 2592000000; // 30 days
  const sixtyDaysAgo = now - 5184000000; // 60 days

  const mockConversations: Conversation[] = [
    {
      id: '1',
      title: 'React Testing Best Practices',
      messages: [
        { id: 'm1', role: 'user', content: 'How to test React components?' },
        { id: 'm2', role: 'ai', content: 'Use React Testing Library with Jest' },
      ],
      sources: [{ type: 'file', name: 'test.tsx', content: 'test code', source: '/path/test.tsx' }],
      createdAt: oneDayAgo,
      updatedAt: oneDayAgo,
    },
    {
      id: '2',
      title: 'TypeScript Advanced Patterns',
      messages: [
        { id: 'm3', role: 'user', content: 'What are discriminated unions?' },
        { id: 'm4', role: 'ai', content: 'Discriminated unions use a literal type...' },
      ],
      sources: [{ type: 'url', name: 'TS Docs', content: 'TypeScript documentation', source: 'https://example.com' }],
      createdAt: twoDaysAgo,
      updatedAt: twoDaysAgo,
    },
    {
      id: '3',
      title: 'Next.js Performance Tips',
      messages: [
        { id: 'm5', role: 'user', content: 'How to optimize Next.js apps?' },
        { id: 'm6', role: 'ai', content: 'Use dynamic imports and React Server Components' },
      ],
      sources: [],
      createdAt: threeDaysAgo,
      updatedAt: threeDaysAgo,
    },
    {
      id: '4',
      title: 'Old Conversation',
      messages: [
        { id: 'm7', role: 'user', content: 'Old question' },
      ],
      sources: [
        { type: 'file', name: 'old.ts', content: 'old code', source: '/path/old.ts' },
        { type: 'url', name: 'Old Link', content: 'Old content', source: 'https://old.com' },
      ],
      createdAt: eightDaysAgo,
      updatedAt: eightDaysAgo,
    },
    {
      id: '5',
      title: 'Very Old Conversation',
      messages: [
        { id: 'm8', role: 'user', content: 'Very old question' },
        { id: 'm9', role: 'ai', content: 'Very old answer' },
        { id: 'm10', role: 'user', content: 'Follow up' },
        { id: 'm11', role: 'ai', content: 'Follow up answer' },
      ],
      sources: [],
      createdAt: thirtyDaysAgo,
      updatedAt: thirtyDaysAgo,
    },
    {
      id: '6',
      title: 'Ancient Conversation',
      messages: [
        { id: 'm12', role: 'user', content: 'Ancient question' },
        { id: 'm13', role: 'ai', content: 'Ancient answer' },
        { id: 'm14', role: 'user', content: 'More questions' },
        { id: 'm15', role: 'ai', content: 'More answers' },
        { id: 'm16', role: 'user', content: 'Even more questions' },
        { id: 'm17', role: 'ai', content: 'Even more answers' },
      ],
      sources: [{ type: 'file', name: 'ancient.ts', content: 'ancient code', source: '/path/ancient.ts' }],
      createdAt: sixtyDaysAgo,
      updatedAt: sixtyDaysAgo,
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

  describe('debouncing', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce search query updates', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, { debounce: 300 }));

      // Rapidly change search query
      act(() => {
        result.current.setSearchQuery('R');
      });
      
      act(() => {
        result.current.setSearchQuery('Re');
      });
      
      act(() => {
        result.current.setSearchQuery('Rea');
      });

      // Before debounce time, should still show all results
      expect(result.current.filteredConversations).toEqual(mockConversations);

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // After debounce, should show filtered results
      expect(result.current.filteredConversations.length).toBeLessThan(mockConversations.length);
    });

    it('should use instant search when debounce is 0 or not provided', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      act(() => {
        result.current.setSearchQuery('Testing Best');
      });

      // Should filter immediately without debounce
      expect(result.current.filteredConversations).toHaveLength(1);
    });
  });

  describe('Date Range Filters', () => {
    it('should filter conversations from today', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { dateRange: 'today' }
      }));

      // None of our test conversations are from today
      expect(result.current.filteredConversations).toHaveLength(0);
    });

    it('should filter conversations from last 7 days', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { dateRange: 'last-7-days' }
      }));

      // Should include conversations from 1, 2, and 3 days ago
      expect(result.current.filteredConversations).toHaveLength(3);
      expect(result.current.filteredConversations.map(c => c.id)).toEqual(['1', '2', '3']);
    });

    it('should filter conversations from last 30 days', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { dateRange: 'last-30-days' }
      }));

      // Should include conversations from 1-8 days ago, not the 30 or 60 day old ones
      expect(result.current.filteredConversations).toHaveLength(4);
      expect(result.current.filteredConversations.map(c => c.id)).toEqual(['1', '2', '3', '4']);
    });

    it('should filter conversations with custom date range', () => {
      const customStartDate = new Date(twoDaysAgo);
      const customEndDate = new Date(threeDaysAgo);

      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { 
          dateRange: 'custom',
          customDateStart: customStartDate,
          customDateEnd: customEndDate
        }
      }));

      // Should include only conversations from 2 and 3 days ago
      expect(result.current.filteredConversations).toHaveLength(2);
      expect(result.current.filteredConversations.map(c => c.id)).toContain('2');
      expect(result.current.filteredConversations.map(c => c.id)).toContain('3');
    });

    it('should return all conversations when dateRange is "all"', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { dateRange: 'all' }
      }));

      expect(result.current.filteredConversations).toHaveLength(6);
    });

    it('should handle invalid custom date range gracefully', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { 
          dateRange: 'custom',
          customDateStart: undefined,
          customDateEnd: undefined
        }
      }));

      // Should return all when custom dates are not provided
      expect(result.current.filteredConversations).toHaveLength(6);
    });
  });

  describe('Source Type Filters', () => {
    it('should filter conversations with file sources only', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { sourceType: 'files' }
      }));

      // Conversations 1, 4, and 6 have file sources
      expect(result.current.filteredConversations).toHaveLength(3);
      expect(result.current.filteredConversations.map(c => c.id)).toEqual(['1', '4', '6']);
    });

    it('should filter conversations with URL sources only', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { sourceType: 'urls' }
      }));

      // Conversations 2 and 4 have URL sources
      expect(result.current.filteredConversations).toHaveLength(2);
      expect(result.current.filteredConversations.map(c => c.id)).toEqual(['2', '4']);
    });

    it('should filter conversations with no sources', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { sourceType: 'none' }
      }));

      // Conversations 3 and 5 have no sources
      expect(result.current.filteredConversations).toHaveLength(2);
      expect(result.current.filteredConversations.map(c => c.id)).toEqual(['3', '5']);
    });

    it('should return all conversations when sourceType is "all"', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { sourceType: 'all' }
      }));

      expect(result.current.filteredConversations).toHaveLength(6);
    });

    it('should handle conversations with both file and URL sources', () => {
      const { result: filesResult } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { sourceType: 'files' }
      }));

      const { result: urlsResult } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { sourceType: 'urls' }
      }));

      // Conversation 4 has both, so should appear in both filter results
      expect(filesResult.current.filteredConversations.map(c => c.id)).toContain('4');
      expect(urlsResult.current.filteredConversations.map(c => c.id)).toContain('4');
    });
  });

  describe('Message Count Filters', () => {
    it('should filter conversations by minimum message count', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { minMessages: 4 }
      }));

      // Conversations 5 (4 messages) and 6 (6 messages) meet the criteria
      expect(result.current.filteredConversations).toHaveLength(2);
      expect(result.current.filteredConversations.map(c => c.id)).toEqual(['5', '6']);
    });

    it('should filter conversations by maximum message count', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { maxMessages: 2 }
      }));

      // Conversations 1, 2, 3 have 2 messages, conversation 4 has 1
      expect(result.current.filteredConversations).toHaveLength(4);
      expect(result.current.filteredConversations.map(c => c.id)).toEqual(['1', '2', '3', '4']);
    });

    it('should filter conversations by both min and max message count', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { minMessages: 2, maxMessages: 4 }
      }));

      // Conversations 1, 2, 3 (2 messages) and 5 (4 messages)
      expect(result.current.filteredConversations).toHaveLength(4);
      expect(result.current.filteredConversations.map(c => c.id)).toEqual(['1', '2', '3', '5']);
    });

    it('should return empty array when min > max messages', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { minMessages: 10, maxMessages: 2 }
      }));

      expect(result.current.filteredConversations).toHaveLength(0);
    });

    it('should handle zero as minimum message count', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { minMessages: 0 }
      }));

      // All conversations have at least 0 messages
      expect(result.current.filteredConversations).toHaveLength(6);
    });
  });

  describe('Combined Filters', () => {
    it('should apply search query and date filter together', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { dateRange: 'last-7-days' }
      }));

      // Conversations 1, 2, 3 are from last 7 days
      expect(result.current.filteredConversations).toHaveLength(3);

      act(() => {
        result.current.setSearchQuery('Testing');
      });

      // Only conversation 1 matches "Testing" within last 7 days
      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].id).toBe('1');
    });

    it('should apply date, source type, and message count filters together', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { 
          dateRange: 'last-30-days',
          sourceType: 'files',
          minMessages: 2,
          maxMessages: 2
        }
      }));

      // Only conversation 1 matches all criteria:
      // - Last 30 days: 1, 2, 3, 4
      // - Has files: 1, 4
      // - Exactly 2 messages: 1 only
      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].id).toBe('1');
    });

    it('should apply all filters including search query', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { 
          dateRange: 'last-7-days',
          sourceType: 'all',
          minMessages: 2
        }
      }));

      // Conversations 1, 2, 3 from last 7 days with 2+ messages
      expect(result.current.filteredConversations).toHaveLength(3);

      act(() => {
        result.current.setSearchQuery('TypeScript');
      });

      // Only conversation 2 matches
      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].id).toBe('2');
    });

    it('should return empty when no conversations match combined filters', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { 
          dateRange: 'today',
          sourceType: 'files',
          minMessages: 10
        }
      }));

      expect(result.current.filteredConversations).toHaveLength(0);
      expect(result.current.hasResults).toBe(false);
    });
  });

  describe('Filter Updates', () => {
    it('should update filters dynamically', () => {
      const { result, rerender } = renderHook(
        ({ filters }: { filters?: ConversationFilters }) => useConversationSearch(mockConversations, { filters }),
        { initialProps: { filters: { dateRange: 'all' } as ConversationFilters } }
      );

      expect(result.current.filteredConversations).toHaveLength(6);

      // Update to filter by last 7 days
      rerender({ filters: { dateRange: 'last-7-days' } });

      expect(result.current.filteredConversations).toHaveLength(3);
    });

    it('should clear filters when filter object is undefined', () => {
      const { result, rerender } = renderHook(
        ({ filters }: { filters?: ConversationFilters }) => useConversationSearch(mockConversations, { filters }),
        { initialProps: { filters: { dateRange: 'last-7-days' } as ConversationFilters | undefined } }
      );

      expect(result.current.filteredConversations).toHaveLength(3);

      // Clear filters
      rerender({ filters: undefined as ConversationFilters | undefined });

      expect(result.current.filteredConversations).toHaveLength(6);
    });
  });

  describe('Clear Filters Method', () => {
    it('should clear filters when filters prop changes to undefined', () => {
      const { result, rerender } = renderHook(
        ({ filters }: { filters?: ConversationFilters }) => useConversationSearch(mockConversations, { filters }),
        { initialProps: { filters: { 
          dateRange: 'last-7-days',
          sourceType: 'files',
          minMessages: 2
        } as ConversationFilters | undefined } }
      );

      expect(result.current.filteredConversations.length).toBeLessThan(6);

      // Clear filters by passing undefined
      rerender({ filters: undefined });

      expect(result.current.filteredConversations).toHaveLength(6);
    });

    it('should clear both search query and filters together', () => {
      const { result, rerender } = renderHook(
        ({ filters }: { filters?: ConversationFilters }) => useConversationSearch(mockConversations, { filters }),
        { initialProps: { filters: { dateRange: 'last-7-days' } as ConversationFilters | undefined } }
      );

      act(() => {
        result.current.setSearchQuery('Testing');
      });

      expect(result.current.filteredConversations).toHaveLength(1);

      act(() => {
        result.current.clearSearch();
      });
      
      // Clear filters by passing undefined
      rerender({ filters: undefined });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.filteredConversations).toHaveLength(6);
    });
  });

  describe('Active Filters State', () => {
    it('should indicate when filters are active', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { dateRange: 'last-7-days' }
      }));

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should indicate when no filters are active', () => {
      const { result } = renderHook(() => useConversationSearch(mockConversations));

      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should indicate filters are active when any filter is set', () => {
      const { result: result1 } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { sourceType: 'files' }
      }));

      const { result: result2 } = renderHook(() => useConversationSearch(mockConversations, {
        filters: { minMessages: 2 }
      }));

      expect(result1.current.hasActiveFilters).toBe(true);
      expect(result2.current.hasActiveFilters).toBe(true);
    });
  });
});

