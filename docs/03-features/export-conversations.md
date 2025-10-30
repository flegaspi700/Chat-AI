# Export Conversations Feature

**Date:** October 30, 2025  
**Version:** 1.0.0  
**Status:** ✅ Implemented

---

## Overview

The Export Conversations feature allows users to download their chat conversations in either plain text (TXT) or PDF format. This enables users to:

- Archive important conversations
- Share conversations outside the app
- Create backups of their chat history
- Include conversations in reports or documentation

---

## Features

### Export Formats

#### 1. **Plain Text (TXT)**
- Clean, readable text format
- Includes conversation metadata (created date, last updated)
- Formatted messages with USER/AI labels
- Sources section with summaries
- Easy to read in any text editor

#### 2. **PDF**
- Professional document format
- Styled with proper typography and spacing
- Color-coded message labels (blue for USER, green for AI)
- Multi-page support with automatic page breaks
- Metadata footer on each page

### Export Features

- **One-Click Export:** Hover over any conversation and click the download icon
- **Format Selection:** Choose between TXT or PDF from a dropdown menu
- **Success Notifications:** Toast notifications confirm successful exports
- **Safe Filenames:** Automatic sanitization of special characters in filenames
- **Timestamps:** Each export includes a timestamp for uniqueness

---

## User Interface

### Export Button Location

The export button appears when hovering over a conversation in the Conversations tab:

1. Navigate to the **Conversations** tab in the sidebar
2. Hover over any saved conversation
3. Click the **download icon** (appears next to the delete button)
4. Select your preferred format: **Export as TXT** or **Export as PDF**

### Visual Design

- **Icon:** Download icon (from Lucide React)
- **Position:** Right side of conversation card, next to delete button
- **Visibility:** Appears on hover (desktop) or always visible (mobile)
- **Dropdown:** Clean dropdown menu with two options

---

## Technical Implementation

### Architecture

```
src/
├── lib/
│   └── export.ts                 # Export utility functions
├── components/
│   └── conversation-history.tsx  # Export UI integration
└── __tests__/
    └── lib/
        └── export.test.ts        # Unit tests (14 tests)
```

### Core Functions

#### `exportConversationToTxt(conversation: Conversation): string`

Converts a conversation object to formatted plain text.

**Output Structure:**
```
==================================================
Conversation Title
==================================================

Created: 10/30/2025, 10:30:00 AM
Last Updated: 10/30/2025, 11:45:00 AM
Messages: 8 messages

--------------------------------------------------
SOURCES
--------------------------------------------------
1. file-name.txt (file)
   Summary: AI-generated summary...

--------------------------------------------------
CONVERSATION
--------------------------------------------------

USER:
What is AI?

--------------------------------------------------

AI:
Artificial Intelligence is...

==================================================
End of conversation
==================================================
```

#### `exportConversationToPdf(conversation: Conversation): Promise<{success: boolean, filename?: string, error?: string}>`

Generates a PDF document using jsPDF library.

**Features:**
- 18pt bold title
- 10pt metadata (gray text)
- Sources section with summaries
- Color-coded messages (user = blue, AI = green)
- Automatic page breaks
- Text wrapping for long content

#### `downloadFile(content: string, filename: string, mimeType: string): void`

Triggers browser download using Blob API.

**Process:**
1. Creates Blob from content
2. Creates temporary download link
3. Triggers click event
4. Cleans up temporary elements

---

## Testing

### Unit Tests (Jest)

**File:** `src/__tests__/lib/export.test.ts`  
**Tests:** 14 passing

**Coverage:**
- ✅ TXT export with all content sections
- ✅ PDF export with proper formatting
- ✅ Filename sanitization
- ✅ Timestamp generation
- ✅ Empty conversation handling
- ✅ Error handling
- ✅ Download file mechanism

### E2E Tests (Playwright)

**File:** `e2e/export-conversations.spec.ts`  
**Tests:** 5 tests across 5 browsers

**Coverage:**
- ✅ Export button visibility on hover
- ✅ Dropdown menu with format options
- ✅ TXT export success toast
- ✅ PDF export success toast
- ✅ Conversation click behavior (export doesn't interfere)

---

## Dependencies

### Production Dependencies

```json
{
  "jspdf": "^2.5.2"
}
```

### Dev Dependencies

```json
{
  "@types/jspdf": "^2.0.0"
}
```

**Why jsPDF?**
- Industry-standard PDF generation library
- 8.4k+ GitHub stars
- Active maintenance
- TypeScript support
- Extensive documentation

---

## Usage Examples

### Exporting a Conversation

```typescript
import { exportAsTxt, exportAsPdf } from '@/lib/export';
import type { Conversation } from '@/lib/types';

// Export as TXT
exportAsTxt(conversation);

// Export as PDF
await exportAsPdf(conversation);
```

### Manual Export with Custom Handling

```typescript
import { exportConversationToTxt, downloadFile } from '@/lib/export';

const conversation: Conversation = {
  id: '123',
  title: 'My Conversation',
  messages: [...],
  sources: [...],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// Generate TXT content
const txtContent = exportConversationToTxt(conversation);

// Trigger download
downloadFile(txtContent, 'my-conversation.txt', 'text/plain');
```

---

## File Naming Convention

### Format

```
{Sanitized_Title}_{Timestamp}.{ext}
```

### Examples

- `What_is_AI_1698624000000.txt`
- `Machine_Learning_Basics_1698710400000.pdf`
- `My_Conversation_About_React_1698796800000.txt`

### Sanitization Rules

1. Remove special characters (keep only `a-zA-Z0-9` and spaces)
2. Replace spaces with underscores
3. Truncate to 50 characters max
4. Append timestamp for uniqueness

---

## Error Handling

### Common Errors

1. **Invalid Conversation Object**
   - Error: "Invalid conversation object"
   - Cause: Null or undefined conversation
   - Solution: Validate conversation before export

2. **PDF Generation Failure**
   - Error: Caught and returned in result object
   - Cause: jsPDF internal error
   - Solution: Check browser compatibility

3. **Download Blocked**
   - Error: Silent failure (browser blocks download)
   - Cause: Browser security settings
   - Solution: User must allow downloads

### Error Toast

When export fails, a destructive toast notification appears:

```
Title: "Export failed"
Description: {error.message}
Variant: destructive
```

---

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile Support

- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+

**Note:** Export button may always be visible on mobile instead of appearing on hover.

---

## Performance Considerations

### TXT Export
- **Speed:** Instant (< 1ms)
- **Memory:** Minimal (~1KB per conversation)
- **File Size:** Small (typically 1-10KB)

### PDF Export
- **Speed:** Fast (< 100ms for most conversations)
- **Memory:** Moderate (~100KB for jsPDF library)
- **File Size:** Medium (typically 10-100KB depending on content)

### Optimization Tips

1. For very long conversations (100+ messages), export may take 1-2 seconds
2. PDF generation happens client-side (no server load)
3. Large exports (> 1MB) may cause brief UI freeze

---

## Future Enhancements

### Planned Features

1. **Export All Conversations** - Bulk export feature
2. **Custom Formatting** - User-defined templates
3. **Include Attachments** - Bundle sources in ZIP
4. **Email Integration** - Send exports via email
5. **Cloud Sync** - Auto-backup to cloud storage
6. **Export History** - Track previous exports
7. **Print Optimization** - Better formatting for printing

### Community Requests

- Markdown export format
- DOCX (Word) format
- JSON export for developers
- CSV export for spreadsheet analysis

---

## Accessibility

### Keyboard Support

- ✅ Tab to conversation card
- ✅ Enter to open conversation
- ✅ Tab to export button
- ✅ Enter to open dropdown
- ✅ Arrow keys to select format
- ✅ Enter to confirm export

### Screen Reader Support

- ✅ `aria-label="Export conversation"` on button
- ✅ Descriptive menu item text
- ✅ Success toast announcements

---

## Known Limitations

1. **No Batch Export:** Can only export one conversation at a time
2. **No Format Customization:** Fixed TXT/PDF layouts
3. **Client-Side Only:** No server-side storage
4. **Size Limits:** Very large conversations (1000+ messages) may cause performance issues
5. **No Cancel:** Once export starts, cannot be cancelled

---

## Development Notes

### TDD Approach

This feature was developed using Test-Driven Development:

1. **Red:** Wrote failing tests first
2. **Green:** Implemented minimum code to pass tests
3. **Refactor:** Cleaned up implementation
4. **Repeat:** Iterated for each feature

### Test Results

```
Unit Tests:  14 passed
E2E Tests:   5 passed (25 total runs across browsers)
Coverage:    84.16% statements in export.ts
```

---

## Changelog

### Version 1.0.0 (October 30, 2025)

**Added:**
- TXT export functionality
- PDF export functionality
- Export button UI in conversation history
- Success/error toast notifications
- Comprehensive test suite (14 unit + 5 E2E tests)
- Full documentation

**Technical:**
- Installed jsPDF library
- Created `src/lib/export.ts`
- Updated `conversation-history.tsx`
- Added Jest mock for jsPDF
- Added TextEncoder/TextDecoder to Jest setup

---

## Contributing

### Adding New Export Formats

To add a new export format (e.g., Markdown):

1. Create export function in `src/lib/export.ts`:
   ```typescript
   export function exportConversationToMarkdown(conversation: Conversation): string {
     // Implementation
   }
   ```

2. Add tests in `src/__tests__/lib/export.test.ts`

3. Update dropdown menu in `conversation-history.tsx`:
   ```tsx
   <DropdownMenuItem onClick={(e) => handleExport(e, conversation, 'md')}>
     Export as Markdown
   </DropdownMenuItem>
   ```

4. Update this documentation

---

## Support

### Troubleshooting

**Q: Export button doesn't appear**  
A: Ensure you're hovering over a saved conversation in the Conversations tab.

**Q: PDF won't download**  
A: Check browser download permissions and popup blockers.

**Q: File name is truncated**  
A: This is intentional for very long conversation titles (max 50 chars).

**Q: PDF looks different than expected**  
A: PDF generation uses standard formatting. Custom templates are planned for future versions.

---

## References

- [jsPDF Documentation](https://artskydj.github.io/jsPDF/docs/)
- [Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [File Download Best Practices](https://web.dev/patterns/files/save-a-file/)

---

**Last Updated:** October 30, 2025  
**Author:** DocuNote Development Team  
**License:** MIT
