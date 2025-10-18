'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from './icons';

interface ChatMessagesProps {
  messages: Message[];
  hasFiles: boolean;
}

export function ChatMessages({ messages, hasFiles }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Logo className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-headline font-semibold">Welcome to DocuNote</h2>
        <p className="max-w-md text-muted-foreground">
          {hasFiles ? 'Your files are ready. Ask a question to get started.' : 'Upload a TXT or PDF file and start asking questions to get insights from your document.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex animate-in fade-in items-start gap-3 md:gap-4',
            message.role === 'user' && 'justify-end'
          )}
        >
          {message.role === 'ai' && (
            <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-primary shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Logo className="h-4 w-4 md:h-5 md:w-5" />
              </AvatarFallback>
            </Avatar>
          )}
          <div
            className={cn(
              'max-w-[85%] sm:max-w-2xl md:max-w-3xl rounded-lg p-3 md:p-4',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground border'
            )}
          >
            <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap break-words max-w-none" dangerouslySetInnerHTML={{ __html: message.content }} />
          </div>
          {message.role === 'user' && (
            <Avatar className="h-8 w-8 md:h-9 md:w-9 shrink-0">
              <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export function ChatMessagesSkeleton() {
  return (
     <div className="flex animate-in fade-in items-start gap-4">
        <Avatar className="h-9 w-9 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Logo className="h-5 w-5" />
            </AvatarFallback>
        </Avatar>
        <div className="max-w-lg rounded-lg p-3 bg-secondary">
          <div className="flex items-center justify-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-0"></span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-150"></span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-300"></span>
          </div>
        </div>
    </div>
  )
}
