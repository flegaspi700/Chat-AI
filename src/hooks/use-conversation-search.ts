import { useState, useMemo, useEffect } from 'react';
import type { Conversation } from '@/lib/types';

interface UseConversationSearchReturn {
  filteredConversations: Conversation[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  hasResults: boolean;
}

interface UseConversationSearchOptions {
  debounce?: number; // Debounce delay in milliseconds (default: 0 for instant search)
}

/**
 * Custom hook for searching and filtering conversations
 * Searches both conversation titles and message content
 */
export function useConversationSearch(
  conversations: Conversation[],
  options: UseConversationSearchOptions = {}
): UseConversationSearchReturn {
  const { debounce = 0 } = options;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    if (debounce === 0) {
      setDebouncedQuery(searchQuery);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounce);

    return () => clearTimeout(timer);
  }, [searchQuery, debounce]);

  const filteredConversations = useMemo(() => {
    // If no search query, return all conversations
    const trimmedQuery = debouncedQuery.trim();
    if (!trimmedQuery) {
      return conversations;
    }

    const lowerQuery = trimmedQuery.toLowerCase();

    return conversations.filter((conversation) => {
      // Search in title
      if (conversation.title.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Search in message content (both user and AI messages)
      const hasMessageMatch = conversation.messages.some((message) =>
        message.content.toLowerCase().includes(lowerQuery)
      );

      return hasMessageMatch;
    });
  }, [conversations, debouncedQuery]);

  const hasResults = filteredConversations.length > 0;

  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    filteredConversations,
    searchQuery,
    setSearchQuery,
    clearSearch,
    hasResults,
  };
}
