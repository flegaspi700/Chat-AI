'use client';

import { useState } from 'react';
import type { FileInfo, Message } from '@/lib/types';
import { getAIResponse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from '@/components/chat-header';
import { ChatMessages, ChatMessagesSkeleton } from '@/components/chat-messages';
import { ChatInputForm } from '@/components/chat-input-form';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { FileUpload } from '@/components/file-upload';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (userInput: string) => {
    if (!userInput.trim() || pending) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setPending(true);

    const fileContent = files.map(f => `File: ${f.name}\n${f.content}`).join('\n\n');
    const result = await getAIResponse(userInput, fileContent || undefined);

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
    <>
      <Sidebar>
        <SidebarHeader>
          <h2 className="text-lg font-semibold font-headline">Uploaded Files</h2>
        </SidebarHeader>
        <SidebarContent>
          <FileUpload files={files} setFiles={setFiles} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex flex-col h-screen bg-card border-x">
          <ChatHeader>
             <SidebarTrigger />
          </ChatHeader>
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <ChatMessages messages={messages} hasFiles={files.length > 0} />
            {pending && <ChatMessagesSkeleton />}
          </div>
          <div className="p-4 md:p-6 border-t bg-card">
            <ChatInputForm
              onSubmit={handleFormSubmit}
              isPending={pending}
            />
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
