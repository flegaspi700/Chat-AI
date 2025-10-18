# Automated Testing Guide for DocuNote

## 📋 Overview

This guide explains how to set up and run automated tests for the DocuNote application.

## 🚀 Quick Start

### 1. Install Testing Dependencies

```powershell
# Run the installation script
.\scripts\install-test-deps.ps1

# OR install manually
npm install --save-dev jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @swc/jest @swc/core @playwright/test @testing-library/dom
```

### 2. Install Playwright Browsers

```powershell
npx playwright install
```

### 3. Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:ci && npm run test:e2e"
  }
}
```

## 🧪 Running Tests

### Unit & Integration Tests (Jest)

```powershell
# Run all tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- chat-input-form.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="ChatInputForm"
```

### End-to-End Tests (Playwright)

```powershell
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run tests with browser visible
npm run test:e2e:headed

# Run specific test file
npx playwright test file-upload.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

## 📊 Test Coverage

After running `npm run test:coverage`, view the HTML report:

```powershell
# Windows
start coverage/lcov-report/index.html

# Or manually navigate to:
# file:///d:/Learn/DocuNote/coverage/lcov-report/index.html
```

Coverage goals:
- **Lines**: 75%+
- **Functions**: 70%+
- **Branches**: 70%+
- **Statements**: 75%+

## 🗂️ Test Structure

```
DocuNote/
├── src/
│   └── __tests__/
│       ├── __mocks__/           # Mock data and utilities
│       │   ├── mockFiles.ts
│       │   ├── mockMessages.ts
│       │   ├── mockThemes.ts
│       │   └── mockUrls.ts
│       ├── components/          # Component tests
│       │   ├── chat-input-form.test.tsx
│       │   └── chat-messages.test.tsx
│       ├── integration/         # Integration tests
│       │   └── actions.test.ts
│       └── lib/                # Utility tests
│           └── utils.test.ts
├── e2e/                        # End-to-end tests
│   ├── file-upload.spec.ts
│   ├── url-scraping.spec.ts
│   ├── chat-functionality.spec.ts
│   └── ui-features.spec.ts
├── jest.config.ts              # Jest configuration
├── jest.setup.ts               # Jest setup/mocks
└── playwright.config.ts        # Playwright configuration
```

## 🎯 Test Scenarios

### Unit Tests

✅ **ChatInputForm Component**
- Renders input form
- Submits on Enter key
- Prevents empty submissions
- Disables during pending state
- Clears after submission

✅ **ChatMessages Component**
- Shows empty state
- Renders all messages
- Distinguishes user/AI messages
- Maintains message order

✅ **Utils Functions**
- Class name merging
- Conditional classes
- Tailwind conflict resolution

### Integration Tests

✅ **Server Actions**
- AI response generation
- Error handling
- File content processing
- URL scraping
- Empty input validation

### End-to-End Tests

✅ **File Upload Flow**
- Upload .txt files
- Multiple file uploads
- Remove uploaded files
- Ask questions about files

✅ **URL Scraping Flow**
- Scrape valid URLs
- Handle invalid URLs
- Combine file + URL sources

✅ **Chat Functionality**
- Empty state display
- Message submission
- Loading states
- Conversation history

✅ **UI Features**
- Dark/light mode toggle
- Settings menu
- Mobile responsiveness
- Sidebar toggle

## 🔍 Debugging Tests

### Jest Debugging

```powershell
# Run specific test in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand chat-input-form.test.tsx

# Then attach VS Code debugger or use Chrome DevTools
```

### Playwright Debugging

```powershell
# Interactive debugging
npm run test:e2e:debug

# View test trace on failure
npx playwright show-trace test-results/path-to-trace.zip
```

## 📝 Writing New Tests

### Component Test Template

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from '@/components/your-component';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<YourComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(/* assertion */).toBe(true);
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    await page.click('button');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

## 🚨 Common Issues

### Issue: Tests fail with "Cannot find module"

**Solution**: Ensure all dependencies are installed:
```powershell
npm install
```

### Issue: Playwright tests timeout

**Solution**: Increase timeout or start dev server manually:
```powershell
# In terminal 1
npm run dev

# In terminal 2
npm run test:e2e
```

### Issue: Jest can't find `@testing-library/jest-dom`

**Solution**: Check `jest.setup.ts` is properly configured and imported.

### Issue: E2E tests fail with "Browser not found"

**Solution**: Install Playwright browsers:
```powershell
npx playwright install
```

## 📈 Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## 🎓 Best Practices

### DO ✅

- Write tests before fixing bugs
- Test user behavior, not implementation
- Use data-testid sparingly (prefer accessible selectors)
- Mock external dependencies
- Keep tests isolated and independent
- Use descriptive test names

### DON'T ❌

- Test implementation details
- Share state between tests
- Write tests that depend on order
- Ignore failing tests
- Test third-party libraries
- Over-mock (test real integration when possible)

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

## 🔄 Test Maintenance

### Weekly
- Review and update flaky tests
- Check coverage reports
- Update test data if needed

### Monthly
- Review test execution time
- Update testing dependencies
- Audit test quality

### Quarterly
- Review testing strategy
- Update E2E test scenarios
- Performance benchmark review

---

**Remember**: Good tests give you confidence to ship code! 🚀
