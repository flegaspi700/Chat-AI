'use client';

import { useState, useEffect } from 'react';
import type { FileInfo, Message } from '@/lib/types';
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
import type { AITheme } from '@/lib/types';
import { loadMessages, loadSources, loadAITheme } from '@/lib/storage';
import { useMessagesPersistence, useSourcesPersistence, useAIThemePersistence } from '@/hooks/use-persistence';
import { useStreamingResponse } from '@/hooks/use-streaming';
import { validateMessageLength } from '@/lib/validation';
import { ErrorBoundary, ChatErrorFallback, SidebarErrorFallback } from '@/components/error-boundary';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [pending, setPending] = useState(false);
  const [aiTheme, setAiTheme] = useState<AITheme | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const { toast } = useToast();
  const { streamingText, isStreaming, streamResponse, reset } = useStreamingResponse();

  // Load persisted data on mount
  useEffect(() => {
    const savedMessages = loadMessages();
    const savedSources = loadSources();
    const savedTheme = loadAITheme();
    
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
    if (savedSources.length > 0) {
      setFiles(savedSources);
    }
    if (savedTheme) {
      setAiTheme(savedTheme);
    }
    
    setIsLoaded(true);
    
    // Show welcome back message if there's saved data
    if (savedMessages.length > 0 || savedSources.length > 0) {
      toast({
        title: 'Welcome back!',
        description: `Restored ${savedMessages.length} messages and ${savedSources.length} sources.`,
      });
    }
  }, [toast]);

  // Auto-save data when it changes
  useMessagesPersistence(messages);
  useSourcesPersistence(files);
  useAIThemePersistence(aiTheme);

  const handleClearData = () => {
    setMessages([]);
    setFiles([]);
    setAiTheme(null);
  };

  const handleFormSubmit = async (userInput: string) => {
    if (!userInput.trim() || pending || isStreaming) return;

    // Validate message length
    const validation = validateMessageLength(userInput);
    if (!validation.isValid) {
      toast({
        variant: 'destructive',
        title: validation.error || 'Invalid input',
        description: validation.details || 'Please check your message and try again.',
      });
      return;
    }

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: userInput };
    const aiMessageId = crypto.randomUUID();
    
    setMessages((prev) => [...prev, userMessage]);
    setPending(true);
    setStreamingMessageId(aiMessageId);
    reset();

    const fileContent = files.map(f => `Source: ${f.name} (${f.type})\n${f.content}`).join('\n\n---\n\n');

    // Stream the AI response
    await streamResponse(userInput, fileContent || undefined, {
      onComplete: (fullText) => {
        // Add the complete message to history
        const aiMessage: Message = { id: aiMessageId, role: 'ai', content: fullText };
        setMessages((prev) => [...prev, aiMessage]);
        setStreamingMessageId(null);
        setPending(false);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error,
        });
        setMessages(prev => prev.filter(m => m.id !== userMessage.id)); // Remove user message on error
        setStreamingMessageId(null);
        setPending(false);
      },
    });
  };

  // Don't render until data is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <ErrorBoundary FallbackComponent={SidebarErrorFallback}>
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold font-headline">Sources</h2>
          </SidebarHeader>
          <SidebarContent>
            <FileUpload files={files} setFiles={setFiles} aiTheme={aiTheme} />
          </SidebarContent>
        </Sidebar>
      </ErrorBoundary>
      <SidebarInset>
        <main className="flex flex-col h-screen bg-background">
          <ChatHeader setAiTheme={setAiTheme} onClearData={handleClearData}>
             <SidebarTrigger />
          </ChatHeader>
          <ErrorBoundary FallbackComponent={ChatErrorFallback} resetKeys={[messages.length]}>
            <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6 md:px-8 lg:px-12 xl:px-16">
              <div className="max-w-4xl mx-auto">
                <ChatMessages messages={messages} hasFiles={files.length > 0} />
              {isStreaming && streamingText && (
                <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary">
                    <div className="flex h-full w-full items-center justify-center text-primary-foreground text-sm font-semibold">
                      AI
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="rounded-lg border bg-muted p-3 prose prose-sm dark:prose-invert max-w-none">
                      {streamingText}
                      <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-1" />
                    </div>
                  </div>
                </div>
              )}
              {pending && !isStreaming && <ChatMessagesSkeleton />}
              </div>
            </div>
          </ErrorBoundary>
          <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-8 lg:px-12 xl:px-16 border-t bg-card">
            <div className="max-w-4xl mx-auto">
              <ChatInputForm
                onSubmit={handleFormSubmit}
                isPending={pending}
              />
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
