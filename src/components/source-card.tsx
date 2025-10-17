'use client';

import { useState } from 'react';
import { FileText, Link, Trash2, Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import type { FileInfo } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { summarizeContent } from '@/ai/flows/summarize-content';
import { useToast } from '@/hooks/use-toast';

interface SourceCardProps {
  file: FileInfo;
  onRemove: (source: string) => void;
  onUpdateSummary: (source: string, summary: string) => void;
}

export function SourceCard({ file, onRemove, onUpdateSummary }: SourceCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const result = await summarizeContent({
        content: file.content,
        sourceName: file.name,
        sourceType: file.type,
      });
      
      // Format summary with key points
      const formattedSummary = `${result.summary}\n\n**Key Points:**\n${result.keyPoints.map(point => `• ${point}`).join('\n')}`;
      
      onUpdateSummary(file.source, formattedSummary);
      setIsOpen(true);
      
      toast({
        title: 'Summary Generated',
        description: `Created summary for "${file.name}"`,
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: 'destructive',
        title: 'Summary Error',
        description: 'Failed to generate summary. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const icon = file.type === 'url' ? (
    <Link className="h-4 w-4 text-primary shrink-0" />
  ) : (
    <FileText className="h-4 w-4 text-primary shrink-0" />
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg border bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
    >
      <div className="flex items-center gap-2 p-3">
        {icon}
        <span className="flex-1 truncate font-medium text-sm" title={file.name}>
          {file.name}
        </span>

        {/* Generate Summary Button */}
        {!file.summary && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="h-8 w-8 shrink-0 touch-manipulation inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleGenerateSummary}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                )}
                <span className="sr-only">Generate Summary</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate AI Summary</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Toggle Summary Button */}
        {file.summary && (
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="h-8 w-8 shrink-0 touch-manipulation inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle Summary</span>
            </button>
          </CollapsibleTrigger>
        )}

        {/* Remove Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="h-9 w-9 shrink-0 touch-manipulation inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
              onClick={() => onRemove(file.source)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove {file.name}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Summary Content */}
      {file.summary && (
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-0">
            <div className="p-3 bg-muted/50 rounded-md text-xs space-y-2">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-medium mb-2">
                <Sparkles className="h-3 w-3" />
                <span>AI Summary</span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {file.summary}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
