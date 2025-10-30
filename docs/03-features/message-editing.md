# Message Editing

Edit user messages and regenerate AI responses from any point in the conversation.

## Overview

The message editing feature allows you to:
- Edit any user message in a conversation
- Automatically regenerate AI responses from the edited point
- Preserve edit history with timestamps
- Prevent accidental data loss with confirmation dialogs

## How to Use

### Editing a Message

1. **Hover over a user message** - An edit button (pencil icon) will appear
2. **Click the edit button** - The message enters edit mode
3. **Modify the text** in the textarea
4. **Click "Save & Regenerate"** to apply changes, or **"Cancel"** to discard

### What Happens When You Edit

When you edit a message:
1. The message content is updated
2. **All subsequent messages are deleted** (both user and AI messages)
3. A new AI response is generated from the edited message
4. An "Edited" timestamp is added to the message
5. The original content is preserved (for future reference)

### Confirmation Dialog

If editing a message would delete **more than 2 subsequent messages**, a confirmation dialog appears:

```
Regenerate responses?
Editing this message will delete all subsequent messages and 
regenerate the conversation from this point. This action cannot be undone.

[Cancel] [Continue]
```

This prevents accidental loss of long conversation threads.

## Technical Details

### Data Model

Messages with edit metadata:

```typescript
interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  editedAt?: number;        // Timestamp of last edit
  originalContent?: string; // Original content before first edit
}
```

### Core Functions

Located in `src/lib/message-editing.ts`:

#### `editMessage(messages, messageId, newContent)`

Updates a message with new content and edit metadata.

```typescript
const updatedMessages = editMessage(messages, messageId, newContent);
```

**Behavior:**
- Updates the message content
- Sets `editedAt` to current timestamp
- Preserves `originalContent` on first edit only
- Returns new array (immutable)

#### `truncateMessagesAfter(messages, messageId)`

Removes all messages after the specified message.

```typescript
const truncated = truncateMessagesAfter(messages, messageId);
```

**Use case:** Called after editing to remove subsequent messages before regeneration.

#### `shouldShowConfirmation(messages, messageId)`

Determines if confirmation dialog should be shown.

```typescript
const shouldConfirm = shouldShowConfirmation(messages, messageId);
```

**Returns:** `true` if >2 messages would be deleted, `false` otherwise.

### UI Components

#### `EditMessageButton`

Hover-revealed button with tooltip.

**Props:**
- `onEdit: () => void` - Click handler
- `disabled?: boolean` - Disable during streaming

**Features:**
- Only shown for user messages
- Hidden by default, visible on hover
- Disabled during AI streaming

#### `ChatMessages` Edit Mode

Extended with edit functionality:

**New Props:**
- `editingMessageId: string | null` - Currently editing message
- `editedContent: string` - Current textarea content
- `isStreaming: boolean` - Disable edits during streaming
- `onEditStart: (id, content) => void`
- `onEditCancel: () => void`
- `onEditSave: (id, newContent) => void`
- `onEditContentChange: (content) => void`

**Edit Mode UI:**
- Textarea with current message content
- "Save & Regenerate" button (disabled if empty)
- "Cancel" button
- Confirmation dialog for destructive edits

## User Experience

### Visual Feedback

1. **Hover State** - Edit button fades in
2. **Edit Mode** - Message replaced with textarea + buttons
3. **Saving** - Loading state during regeneration
4. **Completed** - "Edited {timestamp}" shown below message

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Edit during streaming | Edit button disabled |
| Edit with no changes | Allowed, but pointless |
| Edit last message | No confirmation (0 messages deleted) |
| Edit first message | Confirmation if conversation is long |
| Cancel edit | Restores original message |
| Empty edited message | Save button disabled |

## Accessibility

- Edit button has `aria-label="Edit message"`
- Keyboard accessible (Tab + Enter)
- Screen reader announces edit mode
- Focus management (auto-focus textarea)

## Testing

### Unit Tests (15 tests)

Located in `src/__tests__/message-editing.test.ts`:

- `editMessage`: 7 tests
  - Content update
  - Timestamp setting
  - Original content preservation
  - Immutability
  - Edge cases

- `truncateMessagesAfter`: 4 tests
  - Truncation logic
  - Edge cases (not found, last message)
  - Immutability

- `shouldShowConfirmation`: 4 tests
  - Threshold logic (>2 messages)
  - Edge cases

### E2E Tests (9 tests)

Located in `e2e/message-editing.spec.ts`:

1. Show edit button on hover
2. Enter edit mode on click
3. Cancel edit without changes
4. Save edit and regenerate
5. Show edited timestamp
6. Show confirmation dialog
7. Proceed after confirmation
8. Disable during streaming
9. Validate message length

## Best Practices

### When to Edit

✅ **Good use cases:**
- Fix typos or clarify questions
- Rephrase for better AI responses
- Explore alternative conversation paths

❌ **Avoid editing when:**
- You want to keep the full conversation history
- Multiple people are collaborating
- You need an audit trail

### Tips

1. **Review before saving** - Edits delete subsequent messages
2. **Use confirmation wisely** - Pay attention to deletion warnings
3. **Consider new conversation** - For major topic changes, start fresh
4. **Check edited timestamp** - Know which messages were modified

## Future Enhancements

Potential improvements:

- [ ] View original content on hover
- [ ] Undo/redo edit history
- [ ] Edit AI messages
- [ ] Branch conversations instead of truncating
- [ ] Collaborative editing with conflict resolution

## Related Features

- **Conversation History** - Edited conversations are auto-saved
- **Export** - Edited messages include edit metadata
- **Search** - Searches edited content, not original

## Troubleshooting

### Edit button not appearing

- Ensure you're hovering over a **user message**
- Check that AI is not currently streaming
- Verify message is not in edit mode

### Save button disabled

- Check that message content is not empty
- Ensure message has changed from original

### Confirmation not showing

- Only shows when >2 messages would be deleted
- Check that you're not editing the last message

## API Reference

See `src/lib/message-editing.ts` for full TypeScript definitions and JSDoc comments.
