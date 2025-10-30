import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

describe('useKeyboardShortcuts', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  describe('Setup and Cleanup', () => {
    it('should register keyboard event listener on mount', () => {
      renderHook(() => useKeyboardShortcuts({}));
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should remove keyboard event listener on unmount', () => {
      const { unmount } = renderHook(() => useKeyboardShortcuts({}));
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('New Conversation Shortcut (Ctrl+N)', () => {
    it('should call onNewConversation when Ctrl+N is pressed', () => {
      const onNewConversation = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onNewConversation }));

      const event = new KeyboardEvent('keydown', { 
        key: 'n', 
        ctrlKey: true 
      });
      window.dispatchEvent(event);

      expect(onNewConversation).toHaveBeenCalledTimes(1);
    });

    it('should call onNewConversation when Cmd+N is pressed (Mac)', () => {
      const onNewConversation = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onNewConversation }));

      const event = new KeyboardEvent('keydown', { 
        key: 'n', 
        metaKey: true 
      });
      window.dispatchEvent(event);

      expect(onNewConversation).toHaveBeenCalledTimes(1);
    });

    it('should not call onNewConversation when only N is pressed', () => {
      const onNewConversation = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onNewConversation }));

      const event = new KeyboardEvent('keydown', { key: 'n' });
      window.dispatchEvent(event);

      expect(onNewConversation).not.toHaveBeenCalled();
    });

    it('should not call onNewConversation when callback is not provided', () => {
      expect(() => {
        renderHook(() => useKeyboardShortcuts({}));
        const event = new KeyboardEvent('keydown', { 
          key: 'n', 
          ctrlKey: true 
        });
        window.dispatchEvent(event);
      }).not.toThrow();
    });
  });

  describe('Search Focus Shortcut (Ctrl+K)', () => {
    it('should call onSearchFocus when Ctrl+K is pressed', () => {
      const onSearchFocus = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onSearchFocus }));

      const event = new KeyboardEvent('keydown', { 
        key: 'k', 
        ctrlKey: true 
      });
      window.dispatchEvent(event);

      expect(onSearchFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onSearchFocus when Cmd+K is pressed (Mac)', () => {
      const onSearchFocus = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onSearchFocus }));

      const event = new KeyboardEvent('keydown', { 
        key: 'k', 
        metaKey: true 
      });
      window.dispatchEvent(event);

      expect(onSearchFocus).toHaveBeenCalledTimes(1);
    });

    it('should prevent default browser behavior for Ctrl+K', () => {
      const onSearchFocus = jest.fn();
      const preventDefault = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onSearchFocus }));

      const event = new KeyboardEvent('keydown', { 
        key: 'k', 
        ctrlKey: true 
      });
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      window.dispatchEvent(event);

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe('Export Shortcut (Ctrl+E)', () => {
    it('should call onExport when Ctrl+E is pressed', () => {
      const onExport = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onExport }));

      const event = new KeyboardEvent('keydown', { 
        key: 'e', 
        ctrlKey: true 
      });
      window.dispatchEvent(event);

      expect(onExport).toHaveBeenCalledTimes(1);
    });

    it('should call onExport when Cmd+E is pressed (Mac)', () => {
      const onExport = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onExport }));

      const event = new KeyboardEvent('keydown', { 
        key: 'e', 
        metaKey: true 
      });
      window.dispatchEvent(event);

      expect(onExport).toHaveBeenCalledTimes(1);
    });

    it('should prevent default browser behavior for Ctrl+E', () => {
      const onExport = jest.fn();
      const preventDefault = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onExport }));

      const event = new KeyboardEvent('keydown', { 
        key: 'e', 
        ctrlKey: true 
      });
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      window.dispatchEvent(event);

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe('Theme Toggle Shortcut (Ctrl+Shift+T)', () => {
    it('should call onThemeToggle when Ctrl+Shift+T is pressed', () => {
      const onThemeToggle = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onThemeToggle }));

      const event = new KeyboardEvent('keydown', { 
        key: 't', 
        ctrlKey: true,
        shiftKey: true 
      });
      window.dispatchEvent(event);

      expect(onThemeToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onThemeToggle when Cmd+Shift+T is pressed (Mac)', () => {
      const onThemeToggle = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onThemeToggle }));

      const event = new KeyboardEvent('keydown', { 
        key: 't', 
        metaKey: true,
        shiftKey: true 
      });
      window.dispatchEvent(event);

      expect(onThemeToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Escape Key', () => {
    it('should call onEscape when Escape is pressed', () => {
      const onEscape = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onEscape }));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledTimes(1);
    });

    it('should not require modifier keys for Escape', () => {
      const onEscape = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onEscape }));

      const event = new KeyboardEvent('keydown', { 
        key: 'Escape',
        ctrlKey: true // Even with ctrl, should still work
      });
      window.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Field Handling', () => {
    it('should not trigger shortcuts when typing in input field', () => {
      const onNewConversation = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onNewConversation }));

      const input = document.createElement('input');
      document.body.appendChild(input);

      const event = new KeyboardEvent('keydown', { 
        key: 'n', 
        ctrlKey: true,
        bubbles: true 
      });
      Object.defineProperty(event, 'target', { value: input });
      input.dispatchEvent(event);

      expect(onNewConversation).not.toHaveBeenCalled();
      
      document.body.removeChild(input);
    });

    it('should not trigger shortcuts when typing in textarea', () => {
      const onNewConversation = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onNewConversation }));

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      const event = new KeyboardEvent('keydown', { 
        key: 'n', 
        ctrlKey: true,
        bubbles: true 
      });
      Object.defineProperty(event, 'target', { value: textarea });
      textarea.dispatchEvent(event);

      expect(onNewConversation).not.toHaveBeenCalled();
      
      document.body.removeChild(textarea);
    });

    it('should allow Escape key even in input fields', () => {
      const onEscape = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onEscape }));

      const input = document.createElement('input');
      document.body.appendChild(input);

      const event = new KeyboardEvent('keydown', { 
        key: 'Escape',
        bubbles: true 
      });
      Object.defineProperty(event, 'target', { value: input });
      window.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledTimes(1);
      
      document.body.removeChild(input);
    });
  });

  describe('Disabled State', () => {
    it('should not trigger shortcuts when disabled', () => {
      const onNewConversation = jest.fn();
      const onSearchFocus = jest.fn();
      const onExport = jest.fn();
      
      renderHook(() => useKeyboardShortcuts({ 
        onNewConversation, 
        onSearchFocus,
        onExport,
        disabled: true 
      }));

      const events = [
        new KeyboardEvent('keydown', { key: 'n', ctrlKey: true }),
        new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }),
        new KeyboardEvent('keydown', { key: 'e', ctrlKey: true })
      ];

      events.forEach(event => window.dispatchEvent(event));

      expect(onNewConversation).not.toHaveBeenCalled();
      expect(onSearchFocus).not.toHaveBeenCalled();
      expect(onExport).not.toHaveBeenCalled();
    });

    it('should trigger shortcuts when enabled', () => {
      const onNewConversation = jest.fn();
      
      renderHook(() => useKeyboardShortcuts({ 
        onNewConversation, 
        disabled: false 
      }));

      const event = new KeyboardEvent('keydown', { key: 'n', ctrlKey: true });
      window.dispatchEvent(event);

      expect(onNewConversation).toHaveBeenCalledTimes(1);
    });
  });

  describe('Case Insensitivity', () => {
    it('should handle uppercase key values', () => {
      const onNewConversation = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onNewConversation }));

      const event = new KeyboardEvent('keydown', { 
        key: 'N', // Uppercase
        ctrlKey: true 
      });
      window.dispatchEvent(event);

      expect(onNewConversation).toHaveBeenCalledTimes(1);
    });

    it('should handle lowercase key values', () => {
      const onNewConversation = jest.fn();
      renderHook(() => useKeyboardShortcuts({ onNewConversation }));

      const event = new KeyboardEvent('keydown', { 
        key: 'n', // Lowercase
        ctrlKey: true 
      });
      window.dispatchEvent(event);

      expect(onNewConversation).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple Shortcuts Together', () => {
    it('should handle all shortcuts independently', () => {
      const onNewConversation = jest.fn();
      const onSearchFocus = jest.fn();
      const onExport = jest.fn();
      const onThemeToggle = jest.fn();
      const onEscape = jest.fn();
      
      renderHook(() => useKeyboardShortcuts({ 
        onNewConversation,
        onSearchFocus,
        onExport,
        onThemeToggle,
        onEscape
      }));

      const events = [
        new KeyboardEvent('keydown', { key: 'n', ctrlKey: true }),
        new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }),
        new KeyboardEvent('keydown', { key: 'e', ctrlKey: true }),
        new KeyboardEvent('keydown', { key: 't', ctrlKey: true, shiftKey: true }),
        new KeyboardEvent('keydown', { key: 'Escape' })
      ];

      events.forEach(event => window.dispatchEvent(event));

      expect(onNewConversation).toHaveBeenCalledTimes(1);
      expect(onSearchFocus).toHaveBeenCalledTimes(1);
      expect(onExport).toHaveBeenCalledTimes(1);
      expect(onThemeToggle).toHaveBeenCalledTimes(1);
      expect(onEscape).toHaveBeenCalledTimes(1);
    });
  });
});
