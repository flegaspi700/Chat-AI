import { useState, useMemo } from 'react';
import type { Conversation } from '@/lib/types';

interface UseConversationSearchReturn {
  filteredConversations: Conversation[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  hasResults: boolean;
}

/**
 * Custom hook for searching and filtering conversations
 * Searches both conversation titles and message content
 */
export function useConversationSearch(
  conversations: Conversation[]
): UseConversationSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    // If no search query, return all conversations
    const trimmedQuery = searchQuery.trim();
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
  }, [conversations, searchQuery]);

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
