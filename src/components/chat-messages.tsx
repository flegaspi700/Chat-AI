'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from './icons';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
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
        <h2 className="text-2xl font-headline font-semibold">Welcome to FileChat AI</h2>
        <p className="max-w-md text-muted-foreground">
          Upload a TXT or PDF file and start asking questions to get insights from your document.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex animate-in fade-in items-start gap-4',
            message.role === 'user' && 'justify-end'
          )}
        >
          {message.role === 'ai' && (
            <Avatar className="h-9 w-9 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Logo className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          )}
          <div
            className={cn(
              'max-w-xl rounded-lg p-3',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            )}
          >
            <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content }} />
          </div>
          {message.role === 'user' && (
            <Avatar className="h-9 w-9">
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
