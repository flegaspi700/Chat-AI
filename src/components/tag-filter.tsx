'use client';

import { Check, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TagMetadata } from '@/lib/types';

interface TagFilterProps {
  allTags: TagMetadata[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

export function TagFilter({
  allTags,
  selectedTags,
  onToggleTag,
  onClearFilters,
}: TagFilterProps) {
  const hasFilters = selectedTags.length > 0;
  const sortedTags = [...allTags].sort((a, b) => b.count - a.count);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-4 w-4 mr-2" />
            Tags
            {hasFilters && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px]">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Filter by tags</span>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFilters();
                }}
              >
                Clear
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortedTags.length === 0 ? (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">
              No tags available
            </div>
          ) : (
            sortedTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name);
              
              return (
                <DropdownMenuItem
                  key={tag.name}
                  onClick={() => onToggleTag(tag.name)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-4 w-4 rounded border flex items-center justify-center',
                          isSelected && 'bg-primary border-primary'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className="text-sm">{tag.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({tag.count})</span>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasFilters && (
        <div className="flex items-center gap-1">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="h-6 px-2 text-xs gap-1"
            >
              {tag}
              <button
                onClick={() => onToggleTag(tag)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-2.5 w-2.5" />
                <span className="sr-only">Remove {tag} filter</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
