# Search Filters

DocuNote provides advanced filtering capabilities to help you find specific conversations quickly and efficiently.

## Overview

The search filter system allows you to narrow down conversations based on multiple criteria:
- **Date Range**: Find conversations from specific time periods
- **Source Type**: Filter by files, URLs, or no sources
- **Search Query**: Combine filters with text search

## Filter Types

### Date Range Filters

Filter conversations by when they were last updated:

| Filter | Description | Example |
|--------|-------------|---------|
| **Today** | Conversations updated today | Shows only today's conversations |
| **Last 7 days** | Conversations from the past week | Useful for recent work |
| **Last 30 days** | Conversations from the past month | Monthly review |
| **All** | No date filtering (default) | Shows all conversations |

### Source Type Filters

Filter conversations by the type of sources they contain:

| Filter | Description | Example |
|--------|-------------|---------|
| **Files only** | Conversations with uploaded files | PDFs, text files, documents |
| **URLs only** | Conversations with web page sources | Scraped articles, documentation |
| **No sources** | Conversations without any sources | Pure chat conversations |
| **All** | No source filtering (default) | Shows all conversations |

### Message Count Filters

*(Coming soon)* Filter by the number of messages in a conversation.

## Using Filters

### Opening the Filter Menu

1. Navigate to the **Conversations** tab in the sidebar
2. Click the **Filters** button below the search box
3. A dropdown menu appears with all available filters

### Applying a Single Filter

1. Open the filter menu
2. Click on any filter option (e.g., "Last 7 days")
3. The filter is immediately applied
4. A badge appears showing the active filter
5. The filter count badge shows on the Filters button

### Applying Multiple Filters

Filters combine with **AND** logic - conversations must match all active filters:

1. Apply your first filter (e.g., "Last 7 days")
2. Open the filter menu again
3. Apply additional filters (e.g., "Files only")
4. Both badges appear below the filter button
5. Only conversations matching both criteria are shown

**Example**: "Last 7 days" + "Files only" shows conversations from the past week that have file attachments.

### Combining with Search

Filters work seamlessly with text search:

1. Type a search query in the search box (e.g., "React")
2. Apply filters (e.g., "Last 30 days")
3. Results show conversations containing "React" from the last 30 days

### Removing Filters

**Remove Individual Filter:**
1. Click the **X** button on any filter badge
2. That specific filter is removed
3. Other filters remain active

**Remove All Filters:**
1. Open the filter menu
2. Click **"Clear all filters"** at the bottom
3. All filters are removed at once

**Toggle Filter:**
1. Open the filter menu
2. Click an already-active filter (marked with ✓)
3. The filter is toggled off

## Visual Indicators

### Filter Count Badge

The Filters button shows a small badge with the number of active filters:
- No badge = No active filters
- **1** = One filter active
- **2** = Two filters active
- etc.

### Active Filter Badges

Active filters appear as badges below the Filters button:
- **Calendar icon** = Date range filter
- **File icon** = Source type filter
- **X button** = Click to remove that specific filter

### Checkmarks in Menu

When you open the filter menu, active filters are marked with a **✓** checkmark.

## Filter Persistence

Filters persist when:
- ✅ Switching between Conversations and Sources tabs
- ✅ Loading a conversation
- ✅ Creating a new conversation
- ❌ Refreshing the page (filters reset)

## Examples

### Find Recent File-Based Conversations

1. Click **Filters**
2. Select **"Last 7 days"**
3. Click **Filters** again
4. Select **"Files only"**
5. **Result**: Only conversations from this week with file attachments

### Find Old URL-Based Conversations

1. Click **Filters**
2. Select **"Last 30 days"** (or no date filter for all time)
3. Click **Filters** again
4. Select **"URLs only"**
5. **Result**: Conversations with web page sources

### Find Today's Pure Chat Conversations

1. Click **Filters**
2. Select **"Today"**
3. Click **Filters** again
4. Select **"No sources"**
5. **Result**: Conversations from today without any files or URLs

### Search + Filter Combo

1. Type **"TypeScript"** in the search box
2. Click **Filters**
3. Select **"Last 7 days"**
4. Click **Filters** again
5. Select **"Files only"**
6. **Result**: Conversations mentioning "TypeScript" from this week with file attachments

## Implementation Details

Search filters are implemented using the `useConversationSearch` hook located at `src/hooks/use-conversation-search.ts`.

### Filter Logic

- **Date Range**: Compares conversation `updatedAt` timestamp with current time
- **Source Type**: Checks the `sources` array for file or URL entries
- **Combined Filters**: All active filters must match (AND logic)

### For Developers

To use search filters in a component:

```typescript
import { useConversationSearch, ConversationFilters } from '@/hooks/use-conversation-search';

function MyComponent() {
  const [filters, setFilters] = useState<ConversationFilters>({});
  
  const { 
    filteredConversations,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
  } = useConversationSearch(conversations, {
    filters,
    debounce: 300,
  });
  
  // Update filters
  setFilters({
    dateRange: 'last-7-days',
    sourceType: 'files',
  });
}
```

### Available Types

```typescript
type DateRangeFilter = 'all' | 'today' | 'last-7-days' | 'last-30-days' | 'custom';
type SourceTypeFilter = 'all' | 'files' | 'urls' | 'none';

interface ConversationFilters {
  dateRange?: DateRangeFilter;
  customDateStart?: Date;
  customDateEnd?: Date;
  sourceType?: SourceTypeFilter;
  minMessages?: number;
  maxMessages?: number;
}
```

## Performance

- **Debouncing**: Search queries are debounced by 300ms to reduce re-renders
- **Memoization**: Filter results are cached using `useMemo`
- **Optimized Filtering**: Filters are applied in order of selectivity

## Accessibility

- All filter options are keyboard accessible
- Screen readers announce active filters
- Filter count is visible and announced
- Clear visual indicators for active filters

## Tips

1. **Start Broad**: Begin with a date range, then narrow down with source type
2. **Use Search First**: If you remember keywords, search before filtering
3. **Clear Often**: Clear filters between different search tasks
4. **Badge Shortcuts**: Click the X on badges for quick individual removal
5. **Toggle Filters**: Click the same filter twice to toggle it on/off

## Future Enhancements

Planned improvements to the filter system:

- [ ] Custom date range picker
- [ ] Message count slider (min/max messages)
- [ ] Filter by AI theme
- [ ] Save filter presets
- [ ] Filter by conversation duration
- [ ] Export filtered results

## Troubleshooting

**No results after filtering?**
- Check if your filters are too restrictive
- Try removing one filter at a time
- Use "Clear all filters" to start fresh

**Filters not working?**
- Ensure conversations exist that match your criteria
- Check the filter count badge to confirm filters are active
- Try refreshing the page

**Filter persists after clearing?**
- Verify you clicked "Clear all filters" or removed all badge X buttons
- Check that no checkmarks appear in the filter menu
