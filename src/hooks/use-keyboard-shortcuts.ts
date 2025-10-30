import { useEffect } from 'react';

export interface KeyboardShortcutHandlers {
  onNewConversation?: () => void;
  onSearchFocus?: () => void;
  onExport?: () => void;
  onThemeToggle?: () => void;
  onEscape?: () => void;
  disabled?: boolean;
}

/**
 * Custom hook for handling keyboard shortcuts throughout the application
 * 
 * Supported shortcuts:
 * - Ctrl/Cmd + N: New conversation
 * - Ctrl/Cmd + K: Focus search input
 * - Ctrl/Cmd + E: Export current conversation
 * - Ctrl/Cmd + Shift + T: Toggle theme
 * - Escape: Close modals/clear search
 * 
 * @param handlers - Object containing callback functions for each shortcut
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const {
    onNewConversation,
    onSearchFocus,
    onExport,
    onThemeToggle,
    onEscape,
    disabled = false,
  } = handlers;

  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields (except Escape)
      const target = event.target as HTMLElement;
      const isInputField = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      // Allow Escape to work everywhere
      if (event.key === 'Escape') {
        onEscape?.();
        return;
      }

      // Don't process other shortcuts in input fields
      if (isInputField) {
        return;
      }

      // Support both Ctrl (Windows/Linux) and Cmd/Meta (Mac)
      const hasModifier = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      // Ctrl/Cmd + N: New conversation
      if (hasModifier && key === 'n' && !event.shiftKey) {
        event.preventDefault();
        onNewConversation?.();
        return;
      }

      // Ctrl/Cmd + K: Focus search
      if (hasModifier && key === 'k' && !event.shiftKey) {
        event.preventDefault();
        onSearchFocus?.();
        return;
      }

      // Ctrl/Cmd + E: Export
      if (hasModifier && key === 'e' && !event.shiftKey) {
        event.preventDefault();
        onExport?.();
        return;
      }

      // Ctrl/Cmd + Shift + T: Toggle theme
      if (hasModifier && event.shiftKey && key === 't') {
        event.preventDefault();
        onThemeToggle?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNewConversation, onSearchFocus, onExport, onThemeToggle, onEscape, disabled]);
}
