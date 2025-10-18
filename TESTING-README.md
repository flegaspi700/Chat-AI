# 🧪 Testing Infrastructure for DocuNote

## ✅ What's Been Created

Comprehensive testing infrastructure for DocuNote project:

### 📁 Test Files Created

```
DocuNote/
├── docs/
│   ├── testing-strategy.md          # Overall testing approach
│   ├── testing-guide.md             # How to run automated tests
│   ├── manual-test-scenarios.md     # Manual testing checklist
│   └── test-package-additions.json  # Dependencies to add
├── src/
│   └── __tests__/
│       ├── __mocks__/               # Mock data
│       │   ├── mockFiles.ts
│       │   ├── mockMessages.ts
│       │   ├── mockThemes.ts
│       │   └── mockUrls.ts
│       ├── components/              # Component tests
│       │   ├── chat-input-form.test.tsx
│       │   └── chat-messages.test.tsx
│       ├── integration/             # Integration tests
│       │   └── actions.test.ts
│       └── lib/                     # Utility tests
│           └── utils.test.ts
├── e2e/                            # End-to-end tests
│   ├── file-upload.spec.ts
│   ├── url-scraping.spec.ts
│   ├── chat-functionality.spec.ts
│   └── ui-features.spec.ts
├── scripts/
│   └── install-test-deps.ps1       # Dependency installer
├── jest.config.ts                  # Jest configuration
├── jest.setup.ts                   # Jest setup & mocks
└── playwright.config.ts            # Playwright config
```

## 🚀 Quick Start

### Step 1: Install Test Dependencies

```powershell
# Option A: Run the script
.\scripts\install-test-deps.ps1

# Option B: Manual installation
npm install --save-dev jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @swc/jest @swc/core @playwright/test @testing-library/dom
```

### Step 2: Install Playwright Browsers

```powershell
npx playwright install
```

### Step 3: Add Test Scripts to package.json

Add these to your `"scripts"` section in `package.json`:

```json
"test": "jest --watch",
"test:ci": "jest --ci --coverage --maxWorkers=2",
"test:coverage": "jest --coverage",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:debug": "playwright test --debug",
"test:all": "npm run test:ci && npm run test:e2e"
```

### Step 4: Run Tests

```powershell
# Unit/Integration tests
npm test

# E2E tests (requires app to be running)
npm run test:e2e

# All tests with coverage
npm run test:all
```

## 📊 Test Coverage

### Unit Tests (Jest)
- ✅ ChatInputForm component
- ✅ ChatMessages component  
- ✅ Utility functions (cn, etc.)

### Integration Tests
- ✅ Server actions (getAIResponse, scrapeUrl)
- ✅ Error handling
- ✅ File content processing

### E2E Tests (Playwright)
- ✅ File upload workflow
- ✅ URL scraping workflow
- ✅ Chat functionality
- ✅ Theme switching
- ✅ Mobile responsiveness

## 🎯 Test Scenarios Covered

### Automated Tests
1. **File Upload**: Text and PDF file processing
2. **URL Scraping**: Valid and invalid URLs
3. **Chat**: Empty states, messages, loading
4. **UI**: Theme toggle, sidebar, mobile layout
5. **Error Handling**: Graceful failures

### Manual Test Checklist
- 16 detailed test scenarios in `docs/manual-test-scenarios.md`
- Browser compatibility testing
- Performance validation
- Accessibility checks

## 📖 Documentation

- **`docs/testing-strategy.md`**: High-level testing approach, tools, and goals
- **`docs/testing-guide.md`**: Step-by-step guide to running tests
- **`docs/manual-test-scenarios.md`**: Manual testing checklist with 16 scenarios

## 🔍 What Each Test Does

### ChatInputForm Tests
```typescript
✅ Renders the input correctly
✅ Submits message on Enter
✅ Prevents empty submissions
✅ Disables during pending state
✅ Clears input after submission
```

### ChatMessages Tests
```typescript
✅ Shows empty state when needed
✅ Renders all conversation messages
✅ Distinguishes user vs AI messages
✅ Maintains correct message order
```

### Server Action Tests
```typescript
✅ Returns AI responses
✅ Handles empty input
✅ Processes file content
✅ Scrapes URLs successfully
✅ Handles errors gracefully
```

### E2E Test Flows
```typescript
✅ Complete file upload → question → answer flow
✅ URL scraping → content extraction → Q&A
✅ Multi-source integration
✅ Source removal
✅ Error recovery
```

## ⚙️ Configuration Files

### `jest.config.ts`
- Jest configuration for Next.js
- Coverage thresholds (75% target)
- Module path mapping
- Test environment setup

### `jest.setup.ts`
- Mock environment variables
- Mock Next.js navigation
- Mock window.matchMedia
- Mock crypto.randomUUID

### `playwright.config.ts`
- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing
- Automatic server startup
- Screenshot/video on failure

## 🐛 Debugging

### Jest Tests
```powershell
# Run specific test
npm test -- chat-input-form.test.tsx

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Verbose output
npm test -- --verbose
```

### Playwright Tests
```powershell
# Interactive UI mode
npm run test:e2e:ui

# Debug mode with breakpoints
npm run test:e2e:debug

# View test trace
npx playwright show-trace test-results/trace.zip
```

## 📈 Next Steps

### Immediate
1. ✅ Install dependencies
2. ✅ Run `npm test` to verify setup
3. ✅ Run `npm run test:e2e` for E2E tests

### Short Term
- Add more component tests (FileUpload, ThemeGenerator)
- Test AI flow functions directly
- Add accessibility tests
- Increase coverage to 80%+

### Long Term
- Set up CI/CD with GitHub Actions
- Add visual regression testing
- Add performance benchmarks
- Add load testing

## 🎓 Learning Resources

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ⚠️ Important Notes

### Mock Data
- All mock data is in `src/__tests__/__mocks__/`
- Update mocks when types change
- Keep mocks realistic

### Test Isolation
- Tests are independent
- No shared state between tests
- Mock external dependencies

### Coverage Goals
- Overall: 75%+
- Critical paths: 90%+
- Don't chase 100% (diminishing returns)

### Performance
- Unit tests should run in < 10s
- E2E tests < 2min total
- Parallelize when possible

## 🔧 Troubleshooting

**Problem**: `Cannot find module @testing-library/react`
**Solution**: Run `npm install` to install dependencies

**Problem**: Playwright browsers not found
**Solution**: Run `npx playwright install`

**Problem**: E2E tests timeout
**Solution**: Ensure dev server is running or check `playwright.config.ts`

**Problem**: Tests pass locally but fail in CI
**Solution**: Check for environment differences, timing issues, or flaky tests

## 📝 Test Writing Guidelines

### DO ✅
- Test user behavior, not implementation
- Use accessible queries (getByRole, getByLabelText)
- Write descriptive test names
- Keep tests simple and focused
- Mock external dependencies

### DON'T ❌
- Test internal component state
- Use implementation-specific selectors
- Share state between tests
- Write tests that depend on order
- Test third-party library code

## 🎉 Summary

You now have:
- ✅ 15+ automated tests ready to run
- ✅ E2E tests for critical user flows
- ✅ Mock data for consistent testing
- ✅ Configuration files set up
- ✅ Comprehensive documentation
- ✅ Manual test checklist with 16 scenarios

**Total Test Scenarios**: 30+ (automated + manual)

---

**Ready to Test!** 🚀

Run `npm test` to get started with automated testing!
