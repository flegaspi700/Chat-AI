# Testing Documentation

## 🧪 Quick Commands

**See [TESTING-README.md](../../TESTING-README.md) in root for full command reference.**

```bash
npm test              # Jest unit tests
npm run test:e2e      # Playwright E2E tests
npm run test:coverage # Coverage report
```

---

## 📖 Testing Strategy

We use **two complementary testing frameworks**:

### Jest (Unit & Integration)
- ✅ Fast tests (milliseconds)
- ✅ Isolated component testing
- ✅ Code coverage tracking
- ✅ Mock external dependencies

### Playwright (End-to-End)
- ✅ Real browser testing
- ✅ Full user flows
- ✅ Cross-browser support
- ✅ Visual regression

---

## 📚 Documentation Index

### Essential Reading (Start Here)

1. **[Jest vs Playwright](./jest-vs-playwright.md)** (~10 min)
   - When to use which framework
   - Decision tree and best practices
   
2. **[Testing Guide](./testing-guide.md)** (~8 min)
   - How to write tests
   - File naming conventions
   - Testing patterns

3. **[Testing Strategy](./testing-strategy.md)** (~7 min)
   - Overall testing approach
   - Coverage goals

### Reference (As Needed)

4. **[Manual Test Scenarios](./manual-test-scenarios.md)** - Manual testing checklist
5. **[Test Cleanup Summary](./test-cleanup-summary.md)** - What was fixed
6. **[E2E Test Analysis](./e2e-test-analysis.md)** - Playwright status

---

## 📊 Current Status (Oct 7, 2025)

### Jest Tests
```
✅ 54 passing tests
⏭️  11 skipped tests (documented)
❌ 0 failures
📈 42% statement coverage
📈 57% branch coverage
```

### Playwright Tests
```
✅ 2 passing (theme toggle)
⏭️  2 skipped
⚠️  Some tests need implementation
```

---

## 🎯 When to Use Which Test?

| Scenario | Use Jest | Use Playwright |
|----------|----------|----------------|
| Component renders | ✅ | ❌ |
| Props handling | ✅ | ❌ |
| State updates | ✅ | ❌ |
| Full user flow | ❌ | ✅ |
| Cross-browser | ❌ | ✅ |
| Navigation | ❌ | ✅ |

**Rule:** 80% Jest (fast), 20% Playwright (critical flows)

---

## 🐛 Debugging

### Jest
```bash
npm test -- --verbose
```

### Playwright
```bash
npx playwright test --ui      # UI mode (recommended)
npx playwright test --debug   # Debug mode
```

---

**See [jest-vs-playwright.md](./jest-vs-playwright.md) for detailed comparison.**
