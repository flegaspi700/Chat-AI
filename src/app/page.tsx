'use client';

import { useState } from 'react';
import type { FileInfo, Message } from '@/lib/types';
import { getAIResponse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from '@/components/chat-header';
import { ChatMessages, ChatMessagesSkeleton } from '@/components/chat-messages';
import { ChatInputForm } from '@/components/chat-input-form';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState<FileInfo>(null);
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (userInput: string) => {
    if (!userInput.trim() || pending) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setPending(true);

    const result = await getAIResponse(userInput, file?.content);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages(prev => prev.filter(m => m.id !== userMessage.id)); // Remove user message on error
    } else if (result.response) {
      const aiMessage: Message = { id: crypto.randomUUID(), role: 'ai', content: result.response };
      setMessages((prev) => [...prev, aiMessage]);
    }
    
    setPending(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col w-full max-w-4xl h-screen bg-card border-x">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <ChatMessages messages={messages} />
          {pending && <ChatMessagesSkeleton />}
        </div>
        <div className="p-4 md:p-6 border-t bg-card">
          <ChatInputForm
            file={file}
            setFile={setFile}
            onSubmit={handleFormSubmit}
            isPending={pending}
          />
        </div>
      </div>
    </main>
  );
}
