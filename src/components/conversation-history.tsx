'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  MessageSquarePlus, 
  Trash2, 
  Clock,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';
import type { Conversation } from '@/lib/types';
import {
  loadConversations,
  deleteConversation,
} from '@/lib/storage';
import { useConversationSearch } from '@/hooks/use-conversation-search';

interface ConversationHistoryProps {
  onNewConversation: () => void;
  onLoadConversation: (conversation: Conversation) => void;
  currentConversationId: string | null;
}

export function ConversationHistory({
  onNewConversation,
  onLoadConversation,
  currentConversationId,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Use search hook with 300ms debounce for better performance
  const { 
    filteredConversations, 
    searchQuery, 
    setSearchQuery, 
    clearSearch, 
    hasResults 
  } = useConversationSearch(conversations, { debounce: 300 });

  // Load conversations on mount
  useEffect(() => {
    setConversations(loadConversations());
  }, []);

  // Refresh conversations when currentConversationId changes
  useEffect(() => {
    setConversations(loadConversations());
  }, [currentConversationId]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
      setConversations(loadConversations());
      
      // If deleting current conversation, start a new one
      if (id === currentConversationId) {
        onNewConversation();
      }
    }
  };

  const handleLoadConversation = (conversation: Conversation) => {
    onLoadConversation(conversation);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* New Conversation Button */}
      <div className="p-3">
        <Button
          onClick={onNewConversation}
          className="w-full min-h-[44px] touch-manipulation"
          variant="outline"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <Separator />

      {/* Search Input */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {conversations.length === 0 ? (
                <>
                  <p>No conversations yet</p>
                  <p className="text-xs mt-1">Start chatting to create your first conversation</p>
                </>
              ) : (
                <>
                  <p>No conversations found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isActive = conversation.id === currentConversationId;
              const isHovered = hoveredId === conversation.id;

              return (
                <div
                  key={conversation.id}
                  onMouseEnter={() => setHoveredId(conversation.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`
                    w-full p-3 rounded-lg transition-all
                    group relative min-h-[44px] cursor-pointer
                    ${isActive 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-accent border border-transparent'
                    }
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r" />
                  )}

                  {/* Conversation Info - Clickable area */}
                  <div 
                    className="flex items-start gap-2 pl-2"
                    onClick={() => handleLoadConversation(conversation)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleLoadConversation(conversation);
                      }
                    }}
                  >
                    <ChevronRight 
                      className={`h-4 w-4 mt-0.5 shrink-0 transition-transform ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm line-clamp-2 mb-1">
                        {conversation.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(conversation.updatedAt)}</span>
                        <span>·</span>
                        <span>{conversation.messages.length} messages</span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      type="button"
                      className={`h-8 w-8 shrink-0 transition-opacity inline-flex items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive touch-manipulation ${
                        isHovered || isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                      onClick={(e) => handleDelete(e, conversation.id)}
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete conversation</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
