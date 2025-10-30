# Message Editing & Conversation Tags Implementation Plan

**Date:** October 30, 2025  
**Features:** Message Editing (#13) & Conversation Tags (#14)  
**Approach:** Test-Driven Development (TDD)

---

## Feature #13: Message Editing

### Overview
Allow users to edit their sent messages and regenerate AI responses based on the edited content. This enables users to refine their questions without starting a new conversation.

### Requirements

#### Functional Requirements
1. **Edit User Messages**
   - Users can edit any of their previous messages
   - Edit mode is triggered by clicking an "Edit" button on user messages
   - Original message is replaced with an editable input field
   - Users can save or cancel the edit

2. **Regenerate AI Response**
   - When a user message is edited, all subsequent messages are removed
   - A new AI response is generated based on the edited message
   - Preserves conversation context (messages before the edited one)
   - Uses the same sources that were available at that point

3. **UI/UX Behavior**
   - Edit button appears on hover for user messages
   - Edit mode shows Save and Cancel buttons
   - Loading state while regenerating response
   - Confirmation dialog if editing would delete multiple messages
   - Disabled during streaming or pending states

#### Data Model Changes

**Update Message type:**
```typescript
export type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  editedAt?: number; // Timestamp of last edit
  originalContent?: string; // Keep track of original for history
};
```

**New state needed:**
- `editingMessageId: string | null` - ID of message being edited
- `editedContent: string` - Temporary content during edit

#### Implementation Plan

**Phase 1: Tests (TDD)**
1. Unit tests for message editing logic
   - `editMessage(messageId, newContent)` function
   - `regenerateFromMessage(messageId)` function
   - Message history truncation
   - Edit state management

2. E2E tests for message editing UI
   - Edit button appears on hover
   - Click edit shows input field
   - Save updates message and regenerates response
   - Cancel restores original message
   - Confirmation dialog for multi-message deletion

**Phase 2: Implementation**
1. Create `EditMessageButton` component
2. Add edit mode to `ChatMessages` component
3. Implement edit logic in `page.tsx`
4. Add regeneration flow
5. Update storage to persist edit metadata

**Phase 3: Documentation**
- Feature guide: `docs/03-features/message-editing.md`
- Update README with feature description
- Add to keyboard shortcuts (Ctrl+Shift+E to edit last message?)

---

## Feature #14: Conversation Tags

### Overview
Allow users to organize conversations with custom tags (e.g., "work", "research", "personal"). Tags enable better organization and filtering of conversations.

### Requirements

#### Functional Requirements
1. **Add Tags to Conversations**
   - Users can add multiple tags to any conversation
   - Tags are created on-the-fly (no predefined list)
   - Tag input with autocomplete from existing tags
   - Visual tag badges on conversations

2. **Manage Tags**
   - Add tags via inline input or dialog
   - Remove tags by clicking X on badge
   - Rename tags (applies to all conversations)
   - Delete tags (with confirmation)

3. **Filter by Tags**
   - Filter conversations by one or multiple tags
   - Tag filter UI in conversation history sidebar
   - Combine tag filters with existing search/filters
   - Show tag counts (e.g., "work (5)")

4. **Tag Organization**
   - Alphabetically sorted tag list
   - Color-coded tags (auto-assigned or custom)
   - Recent tags appear first in autocomplete

#### Data Model Changes

**Update Conversation type:**
```typescript
export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  sources: FileInfo[];
  aiTheme?: AITheme;
  createdAt: number;
  updatedAt: number;
  tags?: string[]; // NEW: Array of tag names
};
```

**New type for tag metadata:**
```typescript
export type TagMetadata = {
  name: string;
  color: string; // Hex color for visual distinction
  count: number; // Number of conversations with this tag
  createdAt: number;
  lastUsed: number;
};
```

**New storage functions:**
- `loadAllTags()` - Get all unique tags with metadata
- `addTagToConversation(conversationId, tag)` - Add tag
- `removeTagFromConversation(conversationId, tag)` - Remove tag
- `renameTag(oldName, newName)` - Rename across all conversations
- `deleteTag(tagName)` - Remove from all conversations

#### Implementation Plan

**Phase 1: Tests (TDD)**
1. Unit tests for tag management
   - Add/remove tags from conversation
   - Tag storage and retrieval
   - Tag filtering logic
   - Tag autocomplete
   - Tag color assignment

2. E2E tests for tag UI
   - Add tag to conversation
   - Remove tag from conversation
   - Filter conversations by tag
   - Tag autocomplete works
   - Tag badges display correctly

**Phase 2: Implementation**
1. Create `ConversationTags` component (tag badges)
2. Create `TagInput` component (autocomplete input)
3. Create `TagFilter` component (filter dropdown)
4. Add tag management to conversation storage
5. Integrate tags into `ConversationHistory`
6. Add tag filter to existing filter system

**Phase 3: Documentation**
- Feature guide: `docs/03-features/conversation-tags.md`
- Update README with feature description
- Add to search filters documentation

---

## Combined Testing Strategy

### Unit Tests
- **Message Editing (15+ tests)**
  - Edit message updates content
  - Edit preserves message ID
  - Edit truncates subsequent messages
  - Regenerate creates new AI message
  - Edit state management (editing/saving/canceling)
  - Edit disabled during streaming
  - Edit metadata persists

- **Conversation Tags (20+ tests)**
  - Add tag to conversation
  - Remove tag from conversation
  - Filter by single tag
  - Filter by multiple tags
  - Tag autocomplete suggestions
  - Tag color assignment
  - Tag count calculation
  - Tag persistence

### E2E Tests
- **Message Editing (8+ tests)**
  - Edit button appears on user message hover
  - Click edit shows textarea
  - Save edit updates message
  - Cancel edit restores original
  - Edit regenerates AI response
  - Confirmation for multi-message deletion
  - Edit disabled during streaming
  - Keyboard shortcut to edit last message

- **Conversation Tags (10+ tests)**
  - Add tag via input shows badge
  - Click X removes tag badge
  - Filter by tag shows tagged conversations
  - Tag autocomplete suggests existing tags
  - Multiple tags filter with AND logic
  - Tag persists after page reload
  - Tag appears in conversation list
  - Tag count updates correctly

---

## Development Phases

### Phase 1: Message Editing (Days 1-2)
1. ✅ Write unit tests for message editing logic
2. ✅ Implement edit functionality in components
3. ✅ Write E2E tests for edit UI
4. ✅ Fix any failing tests
5. ✅ Document the feature

### Phase 2: Conversation Tags (Days 3-4)
1. ✅ Write unit tests for tag management
2. ✅ Implement tag components and storage
3. ✅ Write E2E tests for tag UI
4. ✅ Integrate with existing filters
5. ✅ Document the feature

### Phase 3: Integration & Polish (Day 5)
1. ✅ Test both features together
2. ✅ Ensure filters work with tags and search
3. ✅ Update README and documentation
4. ✅ Create PR with comprehensive summary
5. ✅ Merge to main

---

## Success Criteria

### Message Editing
- ✅ Users can edit any user message
- ✅ Editing truncates and regenerates conversation
- ✅ Edit metadata persists (editedAt, originalContent)
- ✅ Edit UI is intuitive with clear feedback
- ✅ All tests passing (15+ unit, 8+ E2E)
- ✅ Feature documented

### Conversation Tags
- ✅ Users can add/remove tags from conversations
- ✅ Tags enable conversation filtering
- ✅ Tag autocomplete from existing tags
- ✅ Tags persist across sessions
- ✅ All tests passing (20+ unit, 10+ E2E)
- ✅ Feature documented

### Combined
- ✅ Both features work together seamlessly
- ✅ No regression in existing functionality
- ✅ CI/CD pipeline passes
- ✅ Code coverage maintained (>51%)
- ✅ README updated with new features

---

## Technical Decisions

### Message Editing
- **Keep original content:** Store `originalContent` for edit history
- **Truncate strategy:** Remove all messages after edited message
- **Confirmation threshold:** Show dialog if >2 messages would be deleted
- **Edit indicator:** Show "edited" badge on edited messages

### Conversation Tags
- **Tag storage:** Store as array of strings in Conversation object
- **Tag colors:** Auto-assign from predefined palette (12 colors)
- **Tag limit:** Max 5 tags per conversation
- **Tag length:** Max 20 characters per tag
- **Tag filtering:** AND logic (show conversations with ALL selected tags)

---

## Next Steps

1. Start with Message Editing tests (Day 1)
2. Implement Message Editing (Day 2)
3. Move to Conversation Tags tests (Day 3)
4. Implement Conversation Tags (Day 4)
5. Integration testing and polish (Day 5)
6. Create comprehensive PR

**Status:** Planning Complete ✅  
**Next:** Begin writing unit tests for message editing
