import { useState, useCallback } from 'react';
import { getAIResponseStream } from '@/app/actions';

export interface UseStreamingOptions {
  onComplete?: (fullText: string) => void;
  onError?: (error: string) => void;
  onChunk?: (chunk: string) => void;
}

export function useStreamingResponse() {
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamResponse = useCallback(async (
    userInput: string,
    fileContent: string | undefined,
    options?: UseStreamingOptions
  ) => {
    setIsStreaming(true);
    setError(null);
    setStreamingText('');
    let fullText = '';

    try {
      const stream = await getAIResponseStream(userInput, fileContent);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamingText(fullText);
        
        if (options?.onChunk) {
          options.onChunk(chunk);
        }
      }

      if (options?.onComplete) {
        options.onComplete(fullText);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Streaming failed';
      setError(errorMessage);
      
      if (options?.onError) {
        options.onError(errorMessage);
      }
    } finally {
      setIsStreaming(false);
    }

    return fullText;
  }, []);

  const reset = useCallback(() => {
    setStreamingText('');
    setIsStreaming(false);
    setError(null);
  }, []);

  return {
    streamingText,
    isStreaming,
    error,
    streamResponse,
    reset,
  };
}
