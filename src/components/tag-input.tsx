'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  availableTags: string[];
  maxTags?: number;
  maxLength?: number;
  placeholder?: string;
}

export function TagInput({
  value,
  onChange,
  availableTags,
  maxTags = 5,
  maxLength = 20,
  placeholder = 'Add a tag...',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter available tags to exclude already selected ones
  const filteredTags = availableTags.filter(
    (tag) => !value.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    
    if (!normalizedTag) return;
    
    if (value.length >= maxTags) {
      return;
    }
    
    if (normalizedTag.length > maxLength) {
      return;
    }
    
    if (value.includes(normalizedTag)) {
      return;
    }
    
    onChange([...value, normalizedTag]);
    setInputValue('');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    // Show autocomplete when typing
    if (inputValue.length > 0 && filteredTags.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [inputValue, filteredTags.length]);

  const canAddMore = value.length < maxTags;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2 py-1 text-sm"
          >
            <span>{tag}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </Button>
          </div>
        ))}
      </div>

      {canAddMore && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!canAddMore}
                className="pr-10"
                maxLength={maxLength}
              />
              {inputValue.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => handleAddTag(inputValue)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add tag</span>
                </Button>
              )}
            </div>
          </PopoverTrigger>
          {filteredTags.length > 0 && (
            <PopoverContent className="w-[200px] p-2" align="start">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground px-2 py-1.5">Suggested tags</p>
                {filteredTags.slice(0, 5).map((tag) => (
                  <Button
                    key={tag}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          )}
        </Popover>
      )}

      {!canAddMore && (
        <p className="text-xs text-muted-foreground">
          Maximum of {maxTags} tags reached
        </p>
      )}

      {inputValue.length > maxLength - 5 && (
        <p className={cn(
          "text-xs",
          inputValue.length >= maxLength ? "text-destructive" : "text-muted-foreground"
        )}>
          {inputValue.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}
