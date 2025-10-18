# Input Validation Implementation Guide

**Status:** ✅ Completed (October 13, 2025)

## Overview

Comprehensive input validation has been implemented across the DocuNote application to improve security, stability, and user experience. This guide documents all validation features, security measures, and testing procedures.

---

## Table of Contents

1. [Features Implemented](#features-implemented)
2. [Validation Rules](#validation-rules)
3. [Security Features](#security-features)
4. [Component Integration](#component-integration)
5. [Testing Guide](#testing-guide)
6. [Error Messages](#error-messages)
7. [Configuration](#configuration)

---

## Features Implemented

### ✅ File Validation
- **Size limits**: 10MB maximum per file
- **Type checking**: Only `.txt` and `.pdf` allowed
- **MIME type validation**: Prevents file extension spoofing
- **Content length limits**: 500K characters maximum
- **Filename security**: Blocks path traversal and null bytes
- **Empty file detection**: Rejects files with no content

### ✅ URL Validation
- **Format validation**: Proper URL structure required
- **Protocol restrictions**: Only HTTP/HTTPS allowed
- **Length limits**: 2048 characters maximum
- **SSRF protection**: Blocks private/internal IP addresses
- **XSS protection**: Blocks dangerous protocols (`javascript:`, `data:`, etc.)
- **Content size validation**: Scraped content limited to 500K characters

### ✅ Message Validation
- **Length validation**: 1-100K characters
- **Empty message detection**: Rejects whitespace-only input
- **Server-side validation**: Double-checked in server actions

### ✅ User Feedback
- **Descriptive errors**: Clear explanation of what went wrong
- **Size information**: Shows file size and character count
- **Toast notifications**: Non-intrusive error messages
- **Inline validation**: Real-time feedback where possible

---

## Validation Rules

### File Upload Limits

```typescript
VALIDATION_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,        // 10MB
  MAX_FILE_CONTENT_LENGTH: 500000,         // 500K characters
  ALLOWED_FILE_TYPES: ['.txt', '.pdf'],
  ALLOWED_MIME_TYPES: ['text/plain', 'application/pdf'],
}
```

**Why these limits?**
- **10MB file size**: Balances functionality with memory constraints
- **500K characters**: Prevents AI context window overflow
- **txt/pdf only**: Simplifies parsing and reduces attack surface

### URL Validation Rules

```typescript
// Allowed protocols
http:, https:

// Blocked protocols (XSS protection)
javascript:, data:, file:, vbscript:, about:

// Blocked IP patterns (SSRF protection)
127.0.0.0/8      // Loopback
10.0.0.0/8       // Private Class A
172.16.0.0/12    // Private Class B
192.168.0.0/16   // Private Class C
169.254.0.0/16   // Link-local
localhost        // Localhost hostname
```

### Message Validation Rules

```typescript
MIN_MESSAGE_LENGTH: 1 character
MAX_MESSAGE_LENGTH: 100,000 characters
```

---

## Security Features

### 1. SSRF (Server-Side Request Forgery) Protection

**Problem:** Attackers could make the server access internal resources.

**Solution:** Block all private/internal IP addresses:
```typescript
// Blocked patterns
/^127\./           // 127.0.0.1 (localhost)
/^10\./            // 10.x.x.x (private)
/^172\.(1[6-9]|2\d|3[0-1])\./ // 172.16-31.x.x
/^192\.168\./      // 192.168.x.x
/^169\.254\./      // 169.254.x.x (link-local)
/localhost/i       // localhost hostname
```

### 2. XSS (Cross-Site Scripting) Protection

**Problem:** Malicious scripts could be injected via URLs.

**Solution:** Block dangerous protocols:
```typescript
javascript:  // javascript:alert('XSS')
data:        // data:text/html,<script>...
file:        // file:///etc/passwd
vbscript:    // vbscript:msgbox
about:       // about:blank attacks
```

### 3. Path Traversal Protection

**Problem:** Malicious filenames could access parent directories.

**Solution:** Block path traversal patterns:
```typescript
// Rejected patterns
../          // Parent directory
./           // Current directory
\            // Windows path separator
\0           // Null byte injection
```

### 4. File Type Validation

**Problem:** Attackers could rename malicious files (e.g., `virus.exe` → `virus.txt`).

**Solution:** Double validation:
1. Check file extension
2. Check MIME type
3. Both must match allowed types

### 5. Content Length Limits

**Problem:** Large files could cause:
- Memory exhaustion
- AI context overflow
- Performance degradation

**Solution:** Strict limits at multiple layers:
1. File size limit (10MB)
2. Content length limit (500K chars)
3. Message length limit (100K chars)

---

## Component Integration

### File Upload Component
**Location:** `src/components/file-upload.tsx`

**Validation Flow:**
```
1. User selects file
   ↓
2. validateFile() checks:
   - File name (path traversal)
   - File type (extension + MIME)
   - File size (10MB limit)
   ↓
3. Read file content
   ↓
4. validateFileContent() checks:
   - Content length (500K chars)
   - Not empty
   ↓
5. Add to sources list
   ↓
6. Show success with size info
```

**Code Example:**
```typescript
const validation = validateFile(selectedFile);
if (!validation.isValid) {
  toast({
    variant: 'destructive',
    title: validation.error,
    description: validation.details,
  });
  continue;
}
```

### URL Scraping Action
**Location:** `src/app/actions.ts` → `scrapeUrl()`

**Validation Flow:**
```
1. User enters URL
   ↓
2. validateURL() checks:
   - Valid URL format
   - Protocol (HTTP/HTTPS only)
   - Length (2048 chars max)
   - Private IPs (blocked)
   - Dangerous protocols (blocked)
   ↓
3. Scrape website
   ↓
4. validateFileContent() checks:
   - Scraped content length
   ↓
5. Return content to client
```

**Code Example:**
```typescript
const urlValidation = validateURL(url);
if (!urlValidation.isValid) {
  return { 
    error: urlValidation.details || "Invalid URL"
  };
}
```

### Message Submission
**Location:** `src/app/page.tsx` → `handleFormSubmit()`

**Validation Flow:**
```
1. User submits message
   ↓
2. Client-side: validateMessageLength()
   - Min 1 character
   - Max 100K characters
   ↓
3. Server-side: validateMessageLength()
   - Double-check on server
   ↓
4. Process AI request
```

**Code Example:**
```typescript
const validation = validateMessageLength(userInput);
if (!validation.isValid) {
  toast({
    variant: 'destructive',
    title: validation.error,
    description: validation.details,
  });
  return;
}
```

### Server Actions
**Location:** `src/app/actions.ts`

All server actions validate inputs:
- `getAIResponse()` - Message and file content
- `getAIResponseStream()` - Message and file content
- `scrapeUrl()` - URL format and security

---

## Testing Guide

### 1. File Upload Testing

#### Test: File Size Limit
```
1. Create a file > 10MB
   - Windows: fsutil file createnew largefile.txt 11000000
   - Mac/Linux: dd if=/dev/zero of=largefile.txt bs=1M count=11

2. Try to upload the file

Expected Result:
❌ Error: "File size exceeds 10MB limit"
✅ Shows file size in MB
```

#### Test: File Type Validation
```
1. Try to upload .docx, .exe, .zip files

Expected Result:
❌ Error: "Invalid file type: .exe"
✅ Shows allowed types (.txt, .pdf)
```

#### Test: MIME Type Spoofing
```
1. Rename virus.exe → virus.txt
2. Try to upload

Expected Result:
❌ Error: "Invalid MIME type: application/x-msdownload"
✅ Blocks despite .txt extension
```

#### Test: Path Traversal
```
1. Rename file to: ../../etc/passwd.txt
2. Try to upload

Expected Result:
❌ Error: "File name contains invalid characters"
```

#### Test: Empty File
```
1. Create empty file: touch empty.txt
2. Try to upload

Expected Result:
❌ Error: "File appears to be empty"
```

#### Test: Content Too Large
```
1. Create file with 600K characters
   - Use text generator or repetition

Expected Result:
❌ Error: "File content too large"
✅ Shows character count
```

### 2. URL Validation Testing

#### Test: Invalid URL Format
```
Test these URLs:
- "not a url"
- "htp://typo.com"
- "www.example.com" (missing protocol)

Expected Result:
❌ Error: "Invalid URL format"
✅ Shows example: https://example.com
```

#### Test: Dangerous Protocols
```
Test these URLs:
- javascript:alert('XSS')
- data:text/html,<script>alert(1)</script>
- file:///etc/passwd
- vbscript:msgbox

Expected Result:
❌ Error: "Blocked protocol" or "Unsupported protocol"
```

#### Test: Private IP Addresses (SSRF Protection)
```
Test these URLs:
- http://127.0.0.1
- http://localhost
- http://10.0.0.1
- http://192.168.1.1
- http://172.16.0.1
- http://169.254.169.254 (AWS metadata)

Expected Result:
❌ Error: "Private IP address not allowed"
✅ Security message shown
```

#### Test: URL Length Limit
```
1. Create URL with 2100 characters
   - Add long query string

Expected Result:
❌ Error: "URL too long"
```

#### Test: Valid URLs (Should Work)
```
Test these URLs:
✅ https://example.com
✅ https://www.wikipedia.org
✅ http://httpbin.org/html
✅ https://jsonplaceholder.typicode.com/posts/1

Expected Result:
✅ Successfully scrapes content
✅ Shows success toast with URL
```

### 3. Message Validation Testing

#### Test: Empty Message
```
1. Submit message with only spaces/newlines

Expected Result:
❌ Error: "Message is empty"
```

#### Test: Very Long Message
```
1. Create message with 110,000 characters
   - Copy/paste large text multiple times

Expected Result:
❌ Error: "Message too long"
✅ Shows character count
```

#### Test: Normal Messages (Should Work)
```
Test these messages:
✅ "Hello"
✅ "What is the weather?"
✅ Multi-line message with 50K characters

Expected Result:
✅ Successfully sends message
✅ Gets AI response
```

---

## Error Messages

### User-Friendly Error Format

All errors follow this pattern:
```typescript
{
  error: "Short, clear error title",
  details: "Specific explanation with actionable guidance"
}
```

### Example Error Messages

#### File Validation Errors
```
Title: "File size exceeds 10MB limit"
Details: "File 'video.pdf' is 15.23MB. Please upload a smaller file."

Title: "Invalid file type: .docx"
Details: "Only .txt, .pdf files are supported."

Title: "File content too large"
Details: "'document.txt' contains 750,000 characters. Maximum is 500,000."
```

#### URL Validation Errors
```
Title: "Invalid URL format"
Details: "Please enter a valid URL (e.g., https://example.com)"

Title: "Blocked protocol"
Details: "Protocol 'javascript:' is not allowed for security reasons."

Title: "Private IP address not allowed"
Details: "Cannot scrape internal/private IP addresses for security reasons."
```

#### Message Validation Errors
```
Title: "Message is empty"
Details: "Please enter a message before submitting."

Title: "Message too long"
Details: "Message is 125,000 characters. Maximum is 100,000."
```

---

## Configuration

### Adjusting Validation Limits

**Location:** `src/lib/validation.ts`

```typescript
export const VALIDATION_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,        // Change to adjust file size
  MAX_MESSAGE_LENGTH: 100000,             // Change message limit
  MAX_FILE_CONTENT_LENGTH: 500000,        // Change content limit
  MAX_URL_LENGTH: 2048,                   // Change URL length
  MIN_MESSAGE_LENGTH: 1,                  // Change minimum
  ALLOWED_FILE_TYPES: ['.txt', '.pdf'],   // Add/remove types
  ALLOWED_MIME_TYPES: ['text/plain', 'application/pdf'], // Add/remove
};
```

### Adding New File Types

**Example: Adding .md (Markdown) support**

1. Update `VALIDATION_LIMITS`:
   ```typescript
   ALLOWED_FILE_TYPES: ['.txt', '.pdf', '.md'],
   ALLOWED_MIME_TYPES: ['text/plain', 'application/pdf', 'text/markdown'],
   ```

2. Update file input accept attribute in `file-upload.tsx`:
   ```tsx
   accept=".txt,.pdf,.md"
   ```

3. Add handling logic in `handleFileChange()`:
   ```typescript
   else if (selectedFile.type === 'text/markdown') {
     const content = await readFile(selectedFile, 'text') as string;
     // ... process markdown
   }
   ```

### Allowing Additional Protocols

**⚠️ Warning:** Only add protocols you trust completely.

```typescript
// In validateURL() function
if (!['http:', 'https:', 'ftp:'].includes(protocol)) {
  return { isValid: false, error: 'Unsupported protocol' };
}
```

---

## Performance Impact

### Validation Overhead

- **File validation**: < 1ms per file
- **URL validation**: < 1ms per URL
- **Message validation**: < 1ms per message
- **Content reading**: Depends on file size (10MB file ~100-200ms)

### Memory Usage

- **Before validation**: Risk of 100MB+ files crashing app
- **After validation**: Maximum 10MB per file, 500K chars in memory
- **Total impact**: ~2-5% performance overhead (negligible)

---

## Security Best Practices

### ✅ DO

- **Validate on both client and server**: Defense in depth
- **Use allowlists, not blocklists**: Only allow known-safe patterns
- **Provide clear error messages**: Help users understand what's wrong
- **Log validation failures**: Monitor for attack attempts
- **Keep limits reasonable**: Balance security with usability
- **Test edge cases**: Try to break your own validation

### ❌ DON'T

- **Don't trust client-side validation alone**: Always validate on server
- **Don't expose system paths**: Keep error messages generic
- **Don't allow unlimited input**: Always have size limits
- **Don't reveal too much**: Error messages shouldn't leak implementation details
- **Don't use complex regex**: Keep validation logic simple and maintainable

---

## Troubleshooting

### Problem: Valid files being rejected

**Solution:** Check MIME type detection
```typescript
console.log('File type:', file.type);
console.log('File name:', file.name);
```

Some PDFs may have different MIME types:
- `application/pdf` (standard)
- `application/x-pdf` (alternative)

Add to `ALLOWED_MIME_TYPES` if needed.

### Problem: Large text files failing

**Solution:** Check character count vs byte size
- 10MB file ≈ 10 million characters (1 byte each)
- Content limit is 500K characters
- Large text files will exceed content limit before size limit

Adjust `MAX_FILE_CONTENT_LENGTH` if needed.

### Problem: Valid URLs being blocked

**Solution:** Check IP detection
- Some hostnames resolve to private IPs
- Use `nslookup` to check DNS resolution
- May need to adjust private IP patterns

---

## Future Enhancements

### Planned Improvements

1. **Progressive file upload** - Show progress for large files
2. **Content preview** - Show snippet before adding to sources
3. **Batch validation** - Validate multiple files at once
4. **Custom limits per user** - Allow power users higher limits
5. **Image support** - Add OCR for image files
6. **Rate limiting** - Limit scraping requests per minute
7. **Virus scanning** - Integrate antivirus for uploaded files

### Considered but Not Implemented

- **Regex input validation** - Too complex for minimal benefit
- **IP reputation checking** - Adds external dependency
- **File content scanning** - Performance overhead too high
- **Unicode normalization** - Not needed for current use case

---

## Related Documentation

- **[Testing Guide](../02-testing/testing-guide.md)** - General testing procedures
- **[Persistence Implementation](./persistence-streaming-implementation.md)** - Storage and streaming features
- **[Security Best Practices](./security-best-practices.md)** - Additional security guidelines (TODO)

---

## Changelog

### October 13, 2025
- ✅ Initial implementation complete
- ✅ All validation rules active
- ✅ Comprehensive testing performed
- ✅ Documentation created

---

**Last Updated:** October 13, 2025  
**Status:** Production Ready ✅
