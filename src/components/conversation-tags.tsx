'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ConversationTagsProps {
  tags: string[];
  onRemoveTag?: (tag: string) => void;
  onTagClick?: (tag: string) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

export function ConversationTags({
  tags,
  onRemoveTag,
  onTagClick,
  readonly = false,
  size = 'md',
}: ConversationTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        // Simple hash function for consistent colors
        const getTagColor = (tagName: string): string => {
          const colors = [
            'bg-blue-500/10 text-blue-700 dark:text-blue-400',
            'bg-green-500/10 text-green-700 dark:text-green-400',
            'bg-amber-500/10 text-amber-700 dark:text-amber-400',
            'bg-red-500/10 text-red-700 dark:text-red-400',
            'bg-violet-500/10 text-violet-700 dark:text-violet-400',
            'bg-pink-500/10 text-pink-700 dark:text-pink-400',
            'bg-teal-500/10 text-teal-700 dark:text-teal-400',
            'bg-orange-500/10 text-orange-700 dark:text-orange-400',
            'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
            'bg-lime-500/10 text-lime-700 dark:text-lime-400',
            'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
            'bg-purple-500/10 text-purple-700 dark:text-purple-400',
          ];
          
          let hash = 0;
          for (let i = 0; i < tagName.length; i++) {
            hash = (hash << 5) - hash + tagName.charCodeAt(i);
            hash |= 0;
          }
          
          return colors[Math.abs(hash) % colors.length];
        };

        return (
          <Badge
            key={tag}
            variant="secondary"
            className={cn(
              'group flex items-center gap-1',
              getTagColor(tag),
              size === 'sm' ? 'text-xs h-5 px-2' : 'h-6 px-2.5',
              onTagClick && !readonly && 'cursor-pointer hover:opacity-80',
              readonly && 'pr-2'
            )}
            onClick={() => !readonly && onTagClick?.(tag)}
          >
            <span className="font-medium">{tag}</span>
            {!readonly && onRemoveTag && (
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-transparent opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTag(tag);
                }}
              >
                <X className="h-2.5 w-2.5" />
                <span className="sr-only">Remove {tag} tag</span>
              </Button>
            )}
          </Badge>
        );
      })}
    </div>
  );
}
