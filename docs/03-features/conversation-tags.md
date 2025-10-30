# Conversation Tags

Organize and filter conversations using color-coded tags.

## Overview

The conversation tags feature allows you to:
- Add up to 5 tags per conversation
- Filter conversations by one or more tags
- View tag usage statistics
- Quick-filter by clicking tag badges

## How to Use

### Adding Tags

Tags are automatically created and associated with conversations through the conversation metadata.

**Tag Requirements:**
- Maximum 5 tags per conversation
- Maximum 20 characters per tag
- Automatically normalized (lowercase, trimmed)
- Alphanumeric and hyphens allowed

### Viewing Tags

Tags appear on conversation items in the sidebar:
- Color-coded badges (12 colors)
- Consistent colors per tag name
- Click to filter by that tag
- X button to remove tag

### Filtering by Tags

1. **Open TagFilter dropdown** - Click "Tags" button in sidebar
2. **Select tags** - Click checkboxes for desired tags
3. **View filtered results** - Conversations with ALL selected tags
4. **Clear filters** - Click "Clear" button or X on badges

**Filter Logic:**
- Multiple tags use **AND logic** (must have all selected tags)
- Case-insensitive matching
- Combines with date/source filters

## Features

### Color-Coded Badges

Each tag gets a consistent color based on its name:

- 🔵 Blue
- 🟢 Green  
- 🟡 Amber
- 🔴 Red
- 🟣 Violet
- 🩷 Pink
- 🔷 Teal
- 🟠 Orange
- 🟪 Indigo
- 🟩 Lime
- 🔵 Cyan
- 🟪 Purple

**Color Assignment:**
- Deterministic (same tag always gets same color)
- Uses hash function for distribution
- Cycles through 12 colors

### Tag Metadata

Track tag usage across conversations:

```typescript
interface TagMetadata {
  name: string;       // Tag name
  color: string;      // Hex color code
  count: number;      // # of conversations
  createdAt: number;  // First use timestamp
  lastUsed: number;   // Most recent use
}
```

### Smart Filtering

**Filter dropdown shows:**
- All unique tags
- Usage count per tag (e.g., "work (5)")
- Sorted by usage (most used first)
- Checkboxes for multi-select

**Active filters display:**
- Badge for each selected tag
- X button to remove individual filter
- "Clear" button to remove all

## Technical Details

### Data Model

#### Conversation with Tags

```typescript
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  sources: FileInfo[];
  aiTheme?: AITheme;
  tags?: string[];     // NEW: Array of tag names
  createdAt: number;
  updatedAt: number;
}
```

### Core Functions

Located in `src/lib/conversation-tags.ts`:

#### `addTagToConversation(conversation, tag)`

Adds a tag to a conversation with validation.

```typescript
const updated = addTagToConversation(conversation, 'work');
```

**Validation:**
- Maximum 5 tags (returns unchanged if limit reached)
- Maximum 20 characters (truncates if longer)
- Normalizes to lowercase and trims
- Prevents duplicates
- Updates `updatedAt` timestamp

**Returns:** New conversation object (immutable)

#### `removeTagFromConversation(conversation, tag)`

Removes a tag from a conversation.

```typescript
const updated = removeTagFromConversation(conversation, 'work');
```

**Behavior:**
- Case-insensitive removal
- Updates `updatedAt` timestamp
- Returns new object (immutable)
- Handles non-existent tags gracefully

#### `getTagColor(tagName)`

Gets consistent color for a tag.

```typescript
const color = getTagColor('work'); // '#3b82f6' (blue)
```

**Returns:** Hex color code (12 options)

#### `filterConversationsByTags(conversations, tags)`

Filters conversations that have ALL specified tags.

```typescript
const filtered = filterConversationsByTags(conversations, ['work', 'urgent']);
```

**Logic:**
- AND filtering (must have all tags)
- Case-insensitive matching
- Returns new array

#### `getTagsFromConversations(conversations)`

Extracts all unique tags.

```typescript
const allTags = getTagsFromConversations(conversations);
// ['work', 'personal', 'urgent']
```

**Returns:** Sorted array of unique tag names

#### `getAllTags(conversations)`

Gets tag metadata with usage statistics.

```typescript
const tagMetadata = getAllTags(conversations);
// [
//   { name: 'work', color: '#3b82f6', count: 5, ... },
//   { name: 'urgent', color: '#ef4444', count: 2, ... }
// ]
```

**Returns:** Array of TagMetadata, sorted by count (descending)

### UI Components

#### `ConversationTags`

Displays tag badges on conversation items.

**Props:**
```typescript
interface ConversationTagsProps {
  tags: string[];
  onRemoveTag?: (tag: string) => void;
  onTagClick?: (tag: string) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}
```

**Features:**
- Color-coded badges
- Remove button (X icon)
- Click to filter
- Responsive sizing

#### `TagInput`

Input field with autocomplete for adding tags.

**Props:**
```typescript
interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  availableTags: string[];
  maxTags?: number;
  maxLength?: number;
  placeholder?: string;
}
```

**Features:**
- Shows up to 5 suggested tags
- Press Enter or comma to add
- Character count indicator
- Max tags warning

#### `TagFilter`

Dropdown for filtering by tags.

**Props:**
```typescript
interface TagFilterProps {
  allTags: TagMetadata[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}
```

**Features:**
- Checkbox multi-select
- Tag counts (e.g., "work (5)")
- Clear all button
- Active filter badges

## User Experience

### Tag Interaction Flow

1. **Create conversation** → Conversation saved
2. **Add tags** → Tags associated with conversation
3. **View in sidebar** → Tags appear as badges
4. **Click tag** → Filter applied
5. **View filtered** → Only matching conversations
6. **Remove filter** → All conversations visible

### Visual Feedback

| Action | Feedback |
|--------|----------|
| Hover tag | Cursor changes to pointer |
| Click tag | Filter badge appears |
| Remove tag | Tag fades out |
| Max tags reached | Warning message |
| Character limit | Count indicator |

## Constraints

### Tag Limits

- **Per conversation:** 5 tags maximum
- **Tag length:** 20 characters maximum
- **Characters allowed:** Letters, numbers, hyphens
- **Total tags:** Unlimited unique tags across all conversations

### Performance

- Tag filtering is client-side (instant)
- Color calculation uses memoization
- Efficiently handles 100s of conversations

## Accessibility

- Tag badges have proper ARIA labels
- Keyboard navigation support (Tab, Enter)
- Screen reader announces filter state
- High contrast colors for readability

## Testing

### Unit Tests (31 tests)

Located in `src/__tests__/conversation-tags.test.ts`:

- `addTagToConversation`: 7 tests
  - Tag addition
  - Duplicate prevention
  - Normalization
  - Max limit (5 tags)
  - Timestamp updates

- `removeTagFromConversation`: 5 tests
  - Tag removal
  - Non-existent tags
  - Last tag removal
  - Case-insensitive

- `getTagColor`: 4 tests
  - Consistency
  - Uniqueness
  - Hex format
  - Color cycling

- `filterConversationsByTags`: 6 tests
  - Single tag
  - Multiple tags (AND)
  - Case-insensitive
  - No matches

- `getTagsFromConversations`: 4 tests
  - Extraction
  - Uniqueness
  - Sorting
  - Empty handling

- `getAllTags`: 5 tests
  - Metadata generation
  - Count accuracy
  - Color assignment
  - Sorting by usage

### E2E Tests (14 tests)

Located in `e2e/conversation-tags.spec.ts`:

1. Display TagFilter button
2. Show empty state
3. Add tag to conversation
4. Filter by single tag
5. Filter by multiple tags (AND)
6. Display tag counts
7. Show active filter badges
8. Remove filter via badge X
9. Clear all filters
10. Consistent tag colors
11. Remove tag from conversation
12. Update filter count
13. Tag autocomplete
14. Tag persistence

## Use Cases

### Organizing Conversations

```
work          → Work-related discussions
personal      → Personal notes
project-a     → Specific project
urgent        → High priority items
meeting-notes → Meeting summaries
ideas         → Brainstorming sessions
research      → Research findings
```

### Multi-Tag Examples

```
work + urgent        → Urgent work items
work + project-a     → Project A work items  
personal + ideas     → Personal project ideas
research + project-b → Project B research
```

## Best Practices

### Naming Tags

✅ **Good:**
- Short and descriptive (`work`, `urgent`, `project-a`)
- Consistent naming (`proj-1`, `proj-2`, not `project-1`, `proj2`)
- Use hyphens for multi-word (`meeting-notes`)

❌ **Avoid:**
- Very long names (`this-is-a-very-long-tag-name`)
- Special characters (`work!!!`, `urgent???`)
- Inconsistent casing (tags are normalized to lowercase)

### Tag Strategy

**Simple System:**
- Keep it minimal (3-5 common tags)
- Use for high-level categorization
- Don't over-tag

**Advanced System:**
- Create tag hierarchy (`work`, `work-client-a`)
- Use for projects (`proj-alpha`, `proj-beta`)
- Combine with date filters for powerful searches

## Storage

Tags are stored as part of the conversation object in localStorage:

```javascript
{
  "notechat-conversations": [
    {
      "id": "conv_123",
      "title": "Discussion about ML",
      "tags": ["work", "research", "ml"],
      "messages": [...],
      "createdAt": 1698765432000,
      "updatedAt": 1698765432000
    }
  ]
}
```

**Storage Impact:**
- Minimal (strings only, ~10-50 bytes per conversation)
- No separate tag index needed
- Automatically saved with conversations

## Future Enhancements

Potential improvements:

- [ ] Tag suggestions based on conversation content
- [ ] Tag groups/categories
- [ ] Tag colors customization
- [ ] Tag search with autocomplete
- [ ] Bulk tag operations
- [ ] Tag analytics dashboard
- [ ] Export/import tag taxonomy
- [ ] Shared tags across users

## Related Features

- **Conversation History** - Tags displayed on items
- **Search** - Combine tag filters with search
- **Export** - Tags included in exported data
- **Message Editing** - Tags preserved after edits

## Troubleshooting

### Tags not appearing

- Check that conversation was saved (happens automatically)
- Verify tag was added (check localStorage)
- Reload page if needed

### Filter not working

- Ensure tag is selected in dropdown
- Check that conversation actually has the tag
- Verify case-insensitive matching

### Can't add more tags

- Maximum of 5 tags per conversation
- Remove existing tags to add new ones
- Or use different tags on other conversations

### Colors not consistent

- Colors are deterministic based on tag name
- Same tag always gets same color
- Different tags may get same color (12 colors total)

## API Reference

See `src/lib/conversation-tags.ts` for full TypeScript definitions and JSDoc comments.
