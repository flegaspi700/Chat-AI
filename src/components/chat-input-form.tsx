'use client';

import { useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { FileInfo } from '@/lib/types';
import { Paperclip, SendHorizonal, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ChatInputFormProps {
  file: FileInfo;
  setFile: Dispatch<SetStateAction<FileInfo>>;
  onSubmit: (userInput: string) => void;
  isPending: boolean;
}

export function ChatInputForm({ file, setFile, onSubmit, isPending }: ChatInputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState('');
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFile({
            name: selectedFile.name,
            content: e.target?.result as string,
          });
          toast({
            title: "File attached",
            description: `${selectedFile.name} is ready for analysis.`,
          })
        };
        reader.readAsText(selectedFile);
      } else if (selectedFile.type === 'application/pdf') {
        try {
          const reader = new FileReader();
          reader.onload = async (e) => {
            if (!e.target?.result) return;
            try {
              const loadingTask = pdfjsLib.getDocument(new Uint8Array(e.target.result as ArrayBuffer));
              const pdf = await loadingTask.promise;
              let fullText = '';
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
                fullText += pageText + '\n';
              }
              setFile({
                name: selectedFile.name,
                content: fullText,
              });
              toast({
                title: 'File attached',
                description: `${selectedFile.name} is ready for analysis.`,
              });
            } catch (error) {
              console.error('Error parsing PDF:', error);
              toast({
                variant: 'destructive',
                title: 'Error reading PDF',
                description: 'Could not read text from the PDF file.',
              });
            }
          };
          reader.readAsArrayBuffer(selectedFile);
        } catch (error) {
          console.error('Error reading file:', error);
           toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'There was an error reading the selected file.',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Unsupported File Type',
          description: 'Please upload a .txt or .pdf file.',
        });
      }
    }
     // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

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
      {file && (
        <div className="absolute bottom-full left-0 mb-2 w-full">
          <div className="flex items-center gap-2 rounded-md border bg-secondary/50 p-2 text-sm">
            <FileText className="h-5 w-5 text-primary" />
            <span className="flex-1 truncate font-medium">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setFile(null)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      )}
      <div className="relative flex items-end">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.pdf"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute bottom-2 left-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Textarea
          name="userInput"
          placeholder="Ask a question about your document..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="min-h-0 w-full resize-none rounded-full border-2 py-3 pl-12 pr-20 transition-all duration-300 focus:py-5"
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
