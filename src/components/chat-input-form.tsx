'use client';

import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputFormProps {
  onSubmit: (userInput: string) => void;
  isPending: boolean;
}

export function ChatInputForm({ onSubmit, isPending }: ChatInputFormProps) {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    onSubmit(userInput);
    setUserInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end">
        <Textarea
          name="userInput"
          placeholder="Ask a question about your document(s)..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="min-h-0 w-full resize-none rounded-full border-2 py-3 pl-4 pr-20 transition-all duration-300 focus:py-5"
          disabled={isPending}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-2 right-2 rounded-full"
          disabled={isPending || !userInput.trim()}
        >
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
