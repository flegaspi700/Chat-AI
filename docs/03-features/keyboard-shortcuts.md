# Keyboard Shortcuts

DocuNote provides keyboard shortcuts to help you navigate and use the application more efficiently.

## Discoverability

### In-App Help

You can view all available keyboard shortcuts directly in the app:
1. Click the **Settings** button (gear icon) in the top-right corner
2. Select **Keyboard Shortcuts** from the menu
3. A dialog will display all shortcuts organized by category

### Button Tooltips

Hover over any button to see what it does. Tooltips include:
- A description of the button's action
- The keyboard shortcut (if available)

Example tooltips:
- **New Conversation button**: "Start a new conversation (Ctrl+N)"
- **Theme Toggle**: "Toggle theme (Ctrl+Shift+T)"
- **Export button**: "Export conversation (Ctrl+E)"

## Available Shortcuts

### Global Shortcuts

These shortcuts work from anywhere in the application:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+N` (Windows/Linux)<br>`Cmd+N` (Mac) | New Conversation | Creates a new conversation. Saves the current conversation first if it has messages. |
| `Ctrl+K` (Windows/Linux)<br>`Cmd+K` (Mac) | Search Focus | Switches to the Conversations tab and focuses the search input. |
| `Ctrl+E` (Windows/Linux)<br>`Cmd+E` (Mac) | Export | Opens the export dialog for the current conversation (if it has messages). |
| `Ctrl+Shift+T` (Windows/Linux)<br>`Cmd+Shift+T` (Mac) | Toggle Theme | Switches between light and dark themes. |
| `Esc` | Escape | Closes open dialogs and modals. |

## Behavior

### Input Field Protection

Keyboard shortcuts are automatically disabled when you're typing in an input field (like the chat input or search box). This prevents shortcuts from interfering with your text input.

The only exception is the `Esc` key, which works everywhere to close dialogs.

### Disabled State

Shortcuts are temporarily disabled when:
- A message is being sent (pending state)
- AI is streaming a response
- The application is processing a request

This prevents accidental actions during critical operations.

### Cross-Platform Support

All shortcuts automatically adapt to your operating system:
- **Windows/Linux**: Use `Ctrl` key
- **macOS**: Use `Cmd` (⌘) key

### Case Insensitivity

Keyboard shortcuts are case-insensitive. Both lowercase and uppercase keys trigger the same action.

## Examples

### Creating a New Conversation

1. Press `Ctrl+N` (or `Cmd+N` on Mac)
2. Your current conversation is automatically saved
3. A new empty conversation starts
4. You're switched to the Sources tab if no sources are loaded

### Quick Search

1. Press `Ctrl+K` (or `Cmd+K` on Mac) from anywhere
2. You're instantly switched to the Conversations tab
3. The search input is focused and ready for typing
4. Start typing to search your conversations

### Exporting Current Conversation

1. Press `Ctrl+E` (or `Cmd+E` on Mac)
2. The export dialog opens (if you have messages)
3. Choose your export format (TXT or PDF)
4. Press `Esc` to close the dialog without exporting

### Quick Theme Toggle

1. Press `Ctrl+Shift+T` (or `Cmd+Shift+T` on Mac)
2. Theme immediately switches between light and dark
3. Your preference is saved automatically

## Implementation Details

Keyboard shortcuts are implemented using the `useKeyboardShortcuts` hook located at `src/hooks/use-keyboard-shortcuts.ts`.

### For Developers

To add keyboard shortcuts to a component:

```typescript
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

function MyComponent() {
  useKeyboardShortcuts({
    onNewConversation: () => {
      // Handle Ctrl+N
    },
    onSearchFocus: () => {
      // Handle Ctrl+K
    },
    onExport: () => {
      // Handle Ctrl+E
    },
    onThemeToggle: () => {
      // Handle Ctrl+Shift+T
    },
    onEscape: () => {
      // Handle Esc
    },
    disabled: false, // Optionally disable all shortcuts
  });
}
```

All handler functions are optional. Only provide handlers for the shortcuts you need.

## Accessibility

- All shortcuts follow common conventions used in modern web applications
- Shortcuts are announced to screen readers through toast notifications
- Visual feedback is provided for all shortcut actions
- Shortcuts can be disabled if needed for accessibility requirements

## Tips

1. **Learn Gradually**: Start with `Ctrl+N` for new conversations and `Ctrl+K` for search
2. **Use Search**: `Ctrl+K` is the fastest way to find past conversations
3. **Quick Export**: `Ctrl+E` lets you export without opening menus
4. **Theme Toggle**: `Ctrl+Shift+T` is perfect for switching themes when presenting
5. **Escape Everything**: When in doubt, press `Esc` to close dialogs

## Browser Compatibility

Some browsers have default shortcuts that may conflict:
- **Chrome/Edge**: `Ctrl+N` opens a new window by default (overridden in the app)
- **Firefox**: `Ctrl+K` opens the search bar (overridden in the app)

DocuNote prevents the default browser behavior for these shortcuts to ensure they work as expected within the application.
