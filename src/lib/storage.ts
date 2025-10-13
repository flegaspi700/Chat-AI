/**
 * localStorage utilities for persisting application state
 * Handles messages, sources, and AI themes with error handling
 */

import type { Message, FileInfo, AITheme } from './types';

const STORAGE_KEYS = {
  MESSAGES: 'notechat-messages',
  SOURCES: 'notechat-sources',
  AI_THEME: 'notechat-ai-theme',
} as const;

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely get item from localStorage with JSON parsing
 */
function getItem<T>(key: string): T | null {
  if (!isStorageAvailable()) return null;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Safely set item to localStorage with JSON stringification
 */
function setItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
function removeItem(key: string): boolean {
  if (!isStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

// ============================================
// Messages Persistence
// ============================================

export function saveMessages(messages: Message[]): boolean {
  return setItem(STORAGE_KEYS.MESSAGES, messages);
}

export function loadMessages(): Message[] {
  return getItem<Message[]>(STORAGE_KEYS.MESSAGES) || [];
}

export function clearMessages(): boolean {
  return removeItem(STORAGE_KEYS.MESSAGES);
}

// ============================================
// Sources Persistence
// ============================================

export function saveSources(sources: FileInfo[]): boolean {
  return setItem(STORAGE_KEYS.SOURCES, sources);
}

export function loadSources(): FileInfo[] {
  return getItem<FileInfo[]>(STORAGE_KEYS.SOURCES) || [];
}

export function clearSources(): boolean {
  return removeItem(STORAGE_KEYS.SOURCES);
}

// ============================================
// AI Theme Persistence
// ============================================

export function saveAITheme(theme: AITheme): boolean {
  return setItem(STORAGE_KEYS.AI_THEME, theme);
}

export function loadAITheme(): AITheme | null {
  return getItem<AITheme>(STORAGE_KEYS.AI_THEME);
}

export function clearAITheme(): boolean {
  return removeItem(STORAGE_KEYS.AI_THEME);
}

// ============================================
// Bulk Operations
// ============================================

/**
 * Clear all NoteChat data from localStorage
 */
export function clearAllData(): boolean {
  return (
    clearMessages() &&
    clearSources() &&
    clearAITheme()
  );
}

/**
 * Get storage usage information
 */
export function getStorageInfo() {
  if (!isStorageAvailable()) {
    return { available: false, usage: 0, total: 0 };
  }
  
  try {
    const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES) || '';
    const sources = localStorage.getItem(STORAGE_KEYS.SOURCES) || '';
    const theme = localStorage.getItem(STORAGE_KEYS.AI_THEME) || '';
    
    const usage = new Blob([messages, sources, theme]).size;
    const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
    
    return {
      available: true,
      usage,
      total,
      usagePercent: (usage / total) * 100,
      usageFormatted: formatBytes(usage),
      totalFormatted: formatBytes(total),
    };
  } catch {
    return { available: false, usage: 0, total: 0 };
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
