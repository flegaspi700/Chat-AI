# Jest vs Playwright: Testing Strategy for NoteChat-AI

**Last Updated:** October 7, 2025  
**Project:** NoteChat-AI (FileChat AI)  
**Author:** Development Team

---

## Table of Contents

1. [Overview](#overview)
2. [Jest Tests - Unit & Integration Testing](#jest-tests---unit--integration-testing)
3. [Playwright Tests - End-to-End Testing](#playwright-tests---end-to-end-testing)
4. [Key Differences](#key-differences)
5. [When to Use Each](#when-to-use-each)
6. [Running Tests](#running-tests)
7. [Project-Specific Examples](#project-specific-examples)
8. [Best Practices](#best-practices)

---

## Overview

NoteChat-AI uses a **two-tier testing strategy** to ensure code quality and user experience:

- **Jest** - Fast, isolated unit and integration tests for components and logic
- **Playwright** - Comprehensive end-to-end tests for complete user workflows

This document explains the differences, use cases, and how to leverage both effectively.

---

## Jest Tests - Unit & Integration Testing

### Purpose
Test individual components, functions, and logic **in isolation** to ensure they work correctly on their own.

### What Jest Tests Cover

✅ **React Components**
- Component rendering
- Props handling
- State management
- Event handlers
- Conditional rendering

✅ **Utility Functions**
- Data formatters
- Validators
- Helper functions
- Class name mergers (e.g., `cn()`)

✅ **Server Actions**
- API logic
- Error handling
- Data transformations
- Business rules

✅ **Integration Points**
- Component + hook interactions
- Multiple components working together
- Service layer integration

### How Jest Works

- **Environment:** Node.js with jsdom (simulated browser DOM)
- **Speed:** Very fast - milliseconds per test
- **Isolation:** Uses mocked data, no real network calls
- **No Real Browser:** Simulates DOM in memory
- **Framework:** React Testing Library for component testing

### Technical Details

```typescript
// Jest Configuration (jest.config.ts)
{
  testEnvironment: 'jsdom',           // Simulates browser environment
  setupFilesAfterEnv: ['jest.setup.ts'], // Setup files
  moduleNameMapper: {                 // Path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {                // Code coverage targets
    global: {
      branches: 70,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
}
```

### Jest Test Example from NoteChat-AI

```typescript
// src/__tests__/lib/utils.test.ts
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should remove duplicate classes', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2'); // Tailwind merge removes conflicting classes
  });
});
```

```typescript
// src/__tests__/components/chat-input-form.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInputForm } from '@/components/chat-input-form';

describe('ChatInputForm', () => {
  it('should render textarea and submit button', () => {
    render(<ChatInputForm onSubmit={jest.fn()} />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', () => {
    const handleSubmit = jest.fn();
    render(<ChatInputForm onSubmit={handleSubmit} />);
    
    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(textarea, { target: { value: 'Hello AI!' } });
    fireEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledWith('Hello AI!');
  });

  it('should disable submit button when input is empty', () => {
    render(<ChatInputForm onSubmit={jest.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    expect(submitButton).toBeDisabled();
  });
});
```

### File Locations

```
src/__tests__/
├── __mocks__/              # Mock data
│   ├── mockFiles.ts
│   ├── mockMessages.ts
│   ├── mockThemes.ts
│   └── mockUrls.ts
├── components/             # Component tests
│   ├── chat-input-form.test.tsx
│   └── chat-messages.test.tsx
├── integration/            # Integration tests
│   └── actions.test.ts
└── lib/                    # Utility tests
    └── utils.test.ts
```

---

## Playwright Tests - End-to-End Testing

### Purpose
Test the **entire application** as a real user would use it, from start to finish, in real browsers.

### What Playwright Tests Cover

✅ **Complete User Workflows**
- Upload file → Ask question → Get response
- Scrape URL → View summary → Download conversation
- Change theme → Verify persistence → Navigate app

✅ **Real Browser Interactions**
- Mouse clicks
- Keyboard typing
- Form submissions
- File uploads/downloads
- Navigation

✅ **Visual & UX Testing**
- Layout rendering
- Responsive design
- Animations
- Error messages
- Loading states

✅ **Cross-Browser Compatibility**
- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)

✅ **Network & API**
- Real HTTP requests
- API responses
- Error handling
- Timeout scenarios

### How Playwright Works

- **Environment:** Real browsers (Chromium, Firefox, WebKit)
- **Speed:** Slower - seconds per test (browser startup, network calls)
- **Integration:** Tests entire stack (frontend + backend + AI)
- **Real Browser:** Actual browser automation
- **Framework:** Playwright Test Runner

### Technical Details

```typescript
// Playwright Configuration (playwright.config.ts)
{
  testDir: './e2e',                    // E2E test directory
  fullyParallel: true,                 // Run tests in parallel
  forbidOnly: !!process.env.CI,       // Prevent .only in CI
  retries: process.env.CI ? 2 : 0,    // Retry flaky tests in CI
  workers: process.env.CI ? 1 : undefined,
  
  use: {
    baseURL: 'http://localhost:9002', // App URL
    trace: 'on-first-retry',          // Debugging traces
    screenshot: 'only-on-failure',    // Screenshots on failures
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  
  webServer: {
    command: 'npm run dev',            // Start dev server
    url: 'http://localhost:9002',
    reuseExistingServer: !process.env.CI,
  },
}
```

### Playwright Test Example from NoteChat-AI

```typescript
// e2e/file-upload.spec.ts
import { test, expect } from '@playwright/test';

test.describe('File Upload Functionality', () => {
  test('should upload a text file and chat about it', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:9002');
    
    // Upload a file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-files/sample-article.txt');
    
    // Wait for file to be processed
    await expect(page.locator('.file-uploaded')).toBeVisible({ timeout: 10000 });
    
    // Ask a question about the file
    const chatInput = page.locator('textarea[placeholder*="message"]');
    await chatInput.fill('What is this document about?');
    
    // Submit the question
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Verify AI response appears
    await expect(page.locator('.message-ai')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.message-ai')).toContainText('AI');
  });

  test('should handle PDF upload', async ({ page }) => {
    await page.goto('http://localhost:9002');
    
    // Upload PDF
    await page.setInputFiles('input[type="file"]', 'test-files/dotnet-csharp.pdf');
    
    // Wait for PDF processing (can take longer)
    await expect(page.locator('.file-uploaded')).toBeVisible({ timeout: 30000 });
    
    // Verify file name is displayed
    await expect(page.locator('.file-name')).toContainText('dotnet-csharp.pdf');
  });

  test('should show error for unsupported file type', async ({ page }) => {
    await page.goto('http://localhost:9002');
    
    // Try to upload unsupported file
    await page.setInputFiles('input[type="file"]', 'test-files/invalid.exe');
    
    // Verify error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('not supported');
  });
});
```

```typescript
// e2e/url-scraping.spec.ts
import { test, expect } from '@playwright/test';

test.describe('URL Scraping Functionality', () => {
  test('should scrape a URL and summarize content', async ({ page }) => {
    await page.goto('http://localhost:9002');
    
    // Enter URL
    const urlInput = page.locator('input[placeholder*="URL"]');
    await urlInput.fill('https://example.com/article');
    
    // Click scrape button
    await page.click('button:has-text("Scrape")');
    
    // Wait for scraping to complete
    await expect(page.locator('.scraping-status')).toContainText('Complete');
    
    // Ask question about scraped content
    await page.fill('textarea', 'Summarize this article');
    await page.click('button[type="submit"]');
    
    // Verify summary appears
    await expect(page.locator('.message-ai')).toBeVisible({ timeout: 20000 });
  });
});
```

### File Locations

```
e2e/
├── chat-functionality.spec.ts   # Chat interaction tests
├── file-upload.spec.ts          # File upload workflow tests
├── ui-features.spec.ts          # UI/UX tests (theme, settings)
└── url-scraping.spec.ts         # URL scraping workflow tests
```

---

## Key Differences

| Aspect | Jest | Playwright |
|--------|------|------------|
| **Speed** | ⚡ Very fast (10-100ms per test) | 🐢 Slower (2-30s per test) |
| **Environment** | Simulated DOM (jsdom) | Real browser |
| **Scope** | Unit/Integration | End-to-End |
| **Isolation** | Highly isolated, mocked | Integrated, real data |
| **Network** | Mocked APIs | Real API calls |
| **Browser** | No real browser | Chromium, Firefox, WebKit |
| **Coverage** | Code-level testing | User workflow testing |
| **Run Command** | `npm test` | `npx playwright test` |
| **When to Run** | During development (constantly) | Before commits/deployment |
| **Cost** | Low (fast execution) | High (resource intensive) |
| **Setup Required** | None (runs in Node.js) | Browsers must be installed |
| **Debugging** | Console logs, breakpoints | Screenshots, videos, traces |
| **CI/CD** | Every commit | Every PR/deployment |
| **Typical Count** | 100s-1000s of tests | 10s-100s of tests |

---

## When to Use Each

### Use Jest When:

✅ Testing individual component behavior  
✅ Validating utility functions  
✅ Testing business logic  
✅ Checking error handling in services  
✅ Verifying state management  
✅ Testing hooks and custom React logic  
✅ Need fast feedback during development  
✅ Writing lots of tests (high volume)  

**Example Scenarios:**
- "Does the `ChatMessage` component render user messages correctly?"
- "Does the `formatDate()` function handle edge cases?"
- "Does the `uploadFile` action validate file types?"

### Use Playwright When:

✅ Testing complete user journeys  
✅ Validating critical business flows  
✅ Testing cross-browser compatibility  
✅ Verifying responsive design  
✅ Testing file upload/download  
✅ Checking navigation and routing  
✅ Testing third-party integrations (AI, APIs)  
✅ Smoke testing before deployment  

**Example Scenarios:**
- "Can a user upload a PDF and ask questions about it?"
- "Does URL scraping work from entering URL to getting a summary?"
- "Can users switch themes and see the change persist?"
- "Does the app work in Safari?"

---

## Running Tests

### Jest Tests

```powershell
# List all discovered test files
npm test -- --listTests

# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm test -- --watch

# Run specific test file
npm test src/__tests__/lib/utils.test.ts

# Run with coverage report
npm test -- --coverage

# Run tests matching pattern
npm test -- --testNamePattern="ChatInputForm"
```

### Playwright Tests

```powershell
# Install Playwright browsers (one-time setup)
npx playwright install

# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test e2e/file-upload.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests with UI mode (interactive debugging)
npx playwright test --ui

# Generate HTML report
npx playwright show-report
```

---

## Project-Specific Examples

### NoteChat-AI Test Coverage

#### Jest Tests (`src/__tests__/`)

**Component Tests:**
```typescript
// chat-input-form.test.tsx - 8 tests
✓ Renders textarea and submit button
✓ Handles user input
✓ Submits message on button click
✓ Submits message on Enter key
✓ Disables submit when input is empty
✓ Shows loading state during submission
✓ Handles errors gracefully
✓ Clears input after successful submission

// chat-messages.test.tsx - 10 tests
✓ Renders empty state when no messages
✓ Displays user messages
✓ Displays AI messages
✓ Formats timestamps correctly
✓ Handles code blocks with syntax highlighting
✓ Auto-scrolls to latest message
✓ Shows typing indicator
✓ Renders file attachments
✓ Handles long messages (truncation)
✓ Copies message to clipboard
```

**Utility Tests:**
```typescript
// utils.test.ts - 6 tests
✓ cn() merges class names
✓ cn() handles conditional classes
✓ cn() removes duplicate Tailwind classes
✓ formatDate() formats dates correctly
✓ formatFileSize() converts bytes to readable format
✓ validateFileType() checks allowed extensions
```

**Integration Tests:**
```typescript
// actions.test.ts - 8 tests
✓ uploadFile action validates file type
✓ uploadFile action handles large files
✓ scrapeUrl action validates URL format
✓ scrapeUrl action handles network errors
✓ sendMessage action calls AI service
✓ sendMessage action handles timeout
✓ generateTheme action creates valid theme
✓ generateTheme action handles invalid input
```

**Total Jest Tests: ~32 tests** (run in ~2 seconds)

#### Playwright Tests (`e2e/`)

**File Upload E2E:**
```typescript
// file-upload.spec.ts - 6 tests
✓ Upload text file and chat about it
✓ Upload PDF and verify processing
✓ Upload HTML file and extract content
✓ Handle multiple file uploads
✓ Show error for unsupported file type
✓ Download conversation with file context
```

**URL Scraping E2E:**
```typescript
// url-scraping.spec.ts - 5 tests
✓ Scrape URL and summarize content
✓ Handle invalid URLs gracefully
✓ Scrape multiple URLs in sequence
✓ Show progress indicator during scraping
✓ Verify scraped content in chat
```

**Chat Functionality E2E:**
```typescript
// chat-functionality.spec.ts - 7 tests
✓ Send message and receive AI response
✓ Continue multi-turn conversation
✓ Copy AI response to clipboard
✓ Clear chat history
✓ Show error on network failure
✓ Handle long responses (streaming)
✓ Regenerate AI response
```

**UI Features E2E:**
```typescript
// ui-features.spec.ts - 6 tests
✓ Toggle light/dark theme
✓ Theme persists across page reload
✓ Open/close settings menu
✓ Generate custom AI theme
✓ Reset to default theme
✓ Responsive layout on mobile viewport
```

**Total Playwright Tests: ~24 tests** (run in ~60-120 seconds)

---

## Best Practices

### Testing Pyramid Approach 🔺

```
           /\
          /  \  E2E (Playwright)
         /____\  ~24 tests (slow, expensive)
        /      \
       /  INTE  \ Integration (Jest)
      /__________\ ~8 tests (medium speed)
     /            \
    /     UNIT     \ Unit (Jest)
   /________________\ ~24 tests (fast, cheap)
```

**Recommended Ratio:**
- **70%** Unit tests (Jest)
- **20%** Integration tests (Jest)
- **10%** E2E tests (Playwright)

### Jest Best Practices

✅ **Write lots of small, focused tests**
```typescript
// Good: Focused test
it('should disable submit button when input is empty', () => {
  render(<ChatInputForm />);
  expect(screen.getByRole('button')).toBeDisabled();
});

// Avoid: Testing too many things at once
it('should handle all input scenarios', () => {
  // 50 lines of test code...
});
```

✅ **Use descriptive test names**
```typescript
// Good: Clear intent
it('should show error message when file exceeds 10MB', () => {});

// Avoid: Vague names
it('should work correctly', () => {});
```

✅ **Mock external dependencies**
```typescript
// Mock Genkit AI calls
jest.mock('@/ai/genkit', () => ({
  generateResponse: jest.fn().mockResolvedValue('Mocked AI response'),
}));
```

✅ **Test behavior, not implementation**
```typescript
// Good: Tests what user sees
expect(screen.getByText('Welcome!')).toBeInTheDocument();

// Avoid: Tests internal state
expect(component.state.isVisible).toBe(true);
```

### Playwright Best Practices

✅ **Test critical user journeys only**
```typescript
// Good: High-value workflow
test('user can upload PDF and get AI summary', async ({ page }) => {});

// Avoid: Testing every button click
test('submit button is blue', async ({ page }) => {});
```

✅ **Use reliable selectors**
```typescript
// Good: Role-based selectors (accessible)
await page.locator('role=button[name="Upload"]').click();

// Good: Test IDs
await page.locator('[data-testid="chat-input"]').fill('Hello');

// Avoid: Fragile CSS selectors
await page.locator('.btn.primary.large.rounded').click();
```

✅ **Handle async operations properly**
```typescript
// Good: Explicit waits
await expect(page.locator('.ai-response')).toBeVisible({ timeout: 15000 });

// Avoid: Arbitrary delays
await page.waitForTimeout(5000);
```

✅ **Clean up between tests**
```typescript
test.beforeEach(async ({ page }) => {
  // Start with clean state
  await page.goto('http://localhost:9002');
  await page.evaluate(() => localStorage.clear());
});
```

### Combined Strategy

**During Development (TDD):**
1. Write Jest test for new feature
2. Implement feature
3. Run Jest tests (fast feedback)
4. Refactor with confidence

**Before Committing:**
1. Run full Jest suite (`npm test`)
2. Run Playwright tests (`npx playwright test`)
3. Check coverage report
4. Commit if all green ✅

**In CI/CD Pipeline:**
1. Run Jest tests on every commit
2. Run Playwright tests on every PR
3. Generate coverage reports
4. Block merge if tests fail

---

## Test Execution Flow

### Local Development
```mermaid
Developer writes code
    ↓
Jest tests run automatically (watch mode)
    ↓
Green tests? → Continue development
    ↓
Ready to commit?
    ↓
Run full Jest suite
    ↓
Run Playwright E2E tests
    ↓
All green? → Commit & push
```

### CI/CD Pipeline
```mermaid
Push to GitHub
    ↓
Install dependencies
    ↓
Run Jest tests (unit + integration)
    ↓
Generate coverage report
    ↓
Run Playwright tests (E2E)
    ↓
All tests pass? → Deploy to staging
    ↓
Manual QA testing
    ↓
Deploy to production
```

---

## Coverage Goals

### Jest Coverage Targets
```typescript
// jest.config.ts
coverageThreshold: {
  global: {
    branches: 70,      // 70% of code branches tested
    functions: 70,     // 70% of functions tested
    lines: 75,         // 75% of code lines tested
    statements: 75,    // 75% of statements tested
  },
}
```

### Playwright Coverage Targets

**Critical Workflows (100% coverage):**
- ✅ File upload → AI chat → Response
- ✅ URL scraping → Summary generation
- ✅ Theme switching → Persistence

**Important Features (80% coverage):**
- ✅ Settings menu
- ✅ Chat history management
- ✅ Error handling flows

**Nice-to-Have Features (50% coverage):**
- ✅ Advanced UI interactions
- ✅ Edge cases
- ✅ Animation testing

---

## Troubleshooting

### Jest Issues

**Problem: Tests fail with "Cannot find module"**
```bash
# Solution: Check moduleNameMapper in jest.config.ts
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

**Problem: "ReferenceError: fetch is not defined"**
```typescript
// Solution: Add polyfill in jest.setup.ts
global.fetch = jest.fn();
```

**Problem: Tests timeout**
```typescript
// Solution: Increase timeout
jest.setTimeout(10000); // 10 seconds
```

### Playwright Issues

**Problem: "browserType.launch: Executable doesn't exist"**
```bash
# Solution: Install browsers
npx playwright install
```

**Problem: Tests fail in CI but pass locally**
```typescript
// Solution: Use consistent waits
await expect(element).toBeVisible({ timeout: 15000 });
```

**Problem: "Target closed" errors**
```typescript
// Solution: Handle navigation properly
await page.goto(url, { waitUntil: 'domcontentloaded' });
```

---

## Additional Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)

### Project Documentation
- `docs/testing-strategy.md` - Overall testing approach
- `docs/testing-guide.md` - How to write tests
- `docs/manual-test-scenarios.md` - Manual testing checklist
- `docs/TESTING-README.md` - Quick reference

### Commands Reference
```powershell
# Jest
npm test                          # Run all Jest tests
npm test -- --coverage           # With coverage report
npm test -- --watch              # Watch mode

# Playwright
npx playwright test              # Run all E2E tests
npx playwright test --ui         # Interactive UI mode
npx playwright test --headed     # See browser
npx playwright show-report       # View test report
```

---

## Conclusion

**Jest** and **Playwright** serve different but complementary purposes:

- **Jest** ensures your code works correctly at the component and function level
- **Playwright** ensures your app works correctly from the user's perspective

**Use both for comprehensive test coverage!**

**Remember:**
- Jest = Fast, focused, developer feedback
- Playwright = Slow, comprehensive, user validation
- Write more Jest tests, fewer Playwright tests
- Run Jest constantly, Playwright before commits

---

**Questions or need help?** See the testing documentation in `docs/` or reach out to the development team.
