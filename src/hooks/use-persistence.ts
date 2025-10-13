import { useEffect, useRef } from 'react';
import { saveMessages, saveSources, saveAITheme } from '@/lib/storage';
import type { Message, FileInfo, AITheme } from '@/lib/types';

/**
 * Hook to auto-save messages to localStorage
 * Debounces saves to avoid excessive writes
 */
export function useMessagesPersistence(messages: Message[]) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    // Clear any pending save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce save by 500ms
    timeoutRef.current = setTimeout(() => {
      if (messages.length > 0) {
        saveMessages(messages);
      }
    }, 500);
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages]);
}

/**
 * Hook to auto-save sources to localStorage
 * Debounces saves to avoid excessive writes
 */
export function useSourcesPersistence(sources: FileInfo[]) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    // Clear any pending save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce save by 500ms
    timeoutRef.current = setTimeout(() => {
      saveSources(sources);
    }, 500);
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sources]);
}

/**
 * Hook to auto-save AI theme to localStorage
 * Saves immediately since theme changes are infrequent
 */
export function useAIThemePersistence(aiTheme: AITheme | null) {
  useEffect(() => {
    if (aiTheme) {
      saveAITheme(aiTheme);
    }
  }, [aiTheme]);
}
