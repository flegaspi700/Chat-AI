'use client';

import { useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { FileInfo } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface FileUploadProps {
  files: FileInfo[];
  setFiles: Dispatch<SetStateAction<FileInfo[]>>;
}

export function FileUpload({ files, setFiles }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    for (const selectedFile of Array.from(selectedFiles)) {
      if (files.some(f => f.name === selectedFile.name)) {
        toast({
          variant: 'destructive',
          title: 'File already exists',
          description: `"${selectedFile.name}" is already in the list.`
        });
        continue;
      }
      
      if (selectedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = e => {
          setFiles(prev => [
            ...prev,
            { name: selectedFile.name, content: e.target?.result as string },
          ]);
          toast({
            title: 'File attached',
            description: `${selectedFile.name} is ready for analysis.`,
          });
        };
        reader.readAsText(selectedFile);
      } else if (selectedFile.type === 'application/pdf') {
        try {
          const reader = new FileReader();
          reader.onload = async e => {
            if (!e.target?.result) return;
            try {
              const loadingTask = pdfjsLib.getDocument(
                new Uint8Array(e.target.result as ArrayBuffer)
              );
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
                { name: selectedFile.name, content: fullText },
              ]);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(f => f.name !== fileName));
  };

  return (
    <div className="p-2 space-y-2">
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
        {files.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No files uploaded.
          </p>
        )}
        {files.map(file => (
          <div
            key={file.name}
            className="flex items-center gap-2 rounded-md border bg-secondary/50 p-2 text-sm"
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
                  onClick={() => removeFile(file.name)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
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
  );
}
