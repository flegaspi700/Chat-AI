'use client';

import { useRef, useState, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, Link, Plus, Trash2, Loader2 } from 'lucide-react';
import { FileInfo, AITheme } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { scrapeUrl } from '@/app/actions';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface FileUploadProps {
  files: FileInfo[];
  setFiles: Dispatch<SetStateAction<FileInfo[]>>;
  aiTheme: AITheme | null;
}

export function FileUpload({ files, setFiles, aiTheme }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const { toast } = useToast();
  
  const urlSources = files.filter(f => f.type === 'url');
  const fileSources = files.filter(f => f.type === 'file');

  const backgroundImage = useMemo(() => {
    if (!aiTheme?.imageHint) return 'none';
    const seed = aiTheme.id.replace(/\D/g, ''); // Use theme id for a consistent image
    return `linear-gradient(to bottom, hsl(var(--background) / 0.8), hsl(var(--background) / 0.8)), url(https://picsum.photos/seed/${seed}/400/600)`;
  }, [aiTheme]);

  const handleAddUrl = async () => {
    if (!url.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid URL',
        description: 'Please enter a valid website URL.',
      });
      return;
    }
    
    if (files.some(f => f.source === url)) {
      toast({
        variant: 'destructive',
        title: 'URL already exists',
        description: `The URL "${url}" is already in the list.`
      });
      return;
    }

    setIsScraping(true);
    const result = await scrapeUrl(url);
    setIsScraping(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Scraping Error',
        description: result.error,
      });
    } else if (result.content) {
      setFiles(prev => [
        ...prev,
        {
          name: result.title || url,
          content: result.content,
          type: 'url',
          source: url,
        },
      ]);
      toast({
        title: 'URL Scraped',
        description: `Content from "${url}" has been added.`,
      });
      setUrl('');
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    for (const selectedFile of Array.from(selectedFiles)) {
      if (files.some(f => f.name === selectedFile.name && f.type === 'file')) {
        toast({
          variant: 'destructive',
          title: 'File already exists',
          description: `"${selectedFile.name}" is already in the list.`,
        });
        continue;
      }

      const readFile = (file: File, type: 'text' | 'arrayBuffer') => {
        return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target?.result || null);
          reader.onerror = reject;
          if (type === 'text') {
            reader.readAsText(file);
          } else {
            reader.readAsArrayBuffer(file);
          }
        });
      };
      
      try {
        if (selectedFile.type === 'text/plain') {
          const content = await readFile(selectedFile, 'text') as string;
          setFiles(prev => [
            ...prev,
            { name: selectedFile.name, content, type: 'file', source: selectedFile.name },
          ]);
          toast({
            title: 'File attached',
            description: `${selectedFile.name} is ready for analysis.`,
          });
        } else if (selectedFile.type === 'application/pdf') {
          const arrayBuffer = await readFile(selectedFile, 'arrayBuffer') as ArrayBuffer;
          if (!arrayBuffer) throw new Error("Could not read PDF file.");

          const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
          const pdf = await loadingTask.promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map(item => ('str' in item ? item.str : ''))
              .join(' ');
            fullText += pageText + '\n';
          }
          setFiles(prev => [
            ...prev,
            { name: selectedFile.name, content: fullText, type: 'file', source: selectedFile.name },
          ]);
          toast({
            title: 'File attached',
            description: `${selectedFile.name} is ready for analysis.`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Unsupported File Type',
            description: 'Please upload a .txt or .pdf file.',
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: `There was an error processing "${selectedFile.name}".`,
        });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (source: string) => {
    setFiles(files.filter(f => f.source !== source));
  };

  return (
    <div
      className={cn('p-2 space-y-4 transition-all duration-500', aiTheme && 'bg-cover bg-center')}
      style={{ backgroundImage }}
      data-ai-hint={aiTheme?.imageHint}
    >
      <div className="space-y-2">
        <h3 className="px-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          URLs
        </h3>
        <Input
          type="url"
          placeholder="Enter a website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isScraping}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddUrl}
          disabled={isScraping || !url.trim()}
        >
          {isScraping ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <Link className="mr-2" />
          )}
          {isScraping ? 'Scraping...' : 'Add URL'}
        </Button>
         <div className="space-y-2">
            {urlSources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
                No URLs added.
            </p>
            ) : urlSources.map(file => (
            <div
                key={file.source}
                className="flex items-center gap-2 rounded-md border bg-card/70 backdrop-blur-sm p-2 text-sm"
            >
                <Link className="h-5 w-5 text-primary" />
                <span className="flex-1 truncate font-medium" title={file.name}>
                {file.name}
                </span>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeFile(file.source)}
                    >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Remove {file.name}</p>
                </TooltipContent>
                </Tooltip>
            </div>
            ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
         <h3 className="px-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Files
        </h3>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.pdf"
            multiple
        />
        <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
        >
            <Plus className="mr-2" />
            Add Files
        </Button>
        <div className="space-y-2">
            {fileSources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
                No files added.
            </p>
            ) : fileSources.map(file => (
            <div
                key={file.source}
                className="flex items-center gap-2 rounded-md border bg-card/70 backdrop-blur-sm p-2 text-sm"
            >
                <FileText className="h-5 w-5 text-primary" />
                <span className="flex-1 truncate font-medium" title={file.name}>
                {file.name}
                </span>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeFile(file.source)}
                    >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Remove {file.name}</p>
                </TooltipContent>
                </Tooltip>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}
