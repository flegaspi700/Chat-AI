# Test Coverage Improvement Plan - 65% Target

**Created:** October 31, 2025  
**Branch:** `feat/increase-test-coverage-to-65`  
**Goal:** Increase test coverage from 57.67% to 65%+  
**Methodology:** Test-Driven Development (TDD)

---

## 📊 Current Coverage Analysis

### Overall Metrics (Baseline)
```
All files: 57.67% statements, 74.9% branches, 42% functions
Target:    65%+ statements, 75%+ branches, 50%+ functions
```

### Files Requiring Tests (Prioritized by Impact)

| File | Current Coverage | Lines Uncovered | Priority | Target |
|------|-----------------|-----------------|----------|--------|
| `tag-input.tsx` | 0% (0/171 lines) | 1-171 | 🔥 CRITICAL | 80%+ |
| `conversation-tags.tsx` | 17.97% | 17-89 | 🔥 HIGH | 80%+ |
| `tag-filter.tsx` | 75.4% | 56-58, 71-95, 103-104 | ⚠️ MEDIUM | 85%+ |
| `conversation-title.tsx` | 57.02% | 31-93 | ⚠️ MEDIUM | 75%+ |
| `conversation-history.tsx` | 85.84% (funcs 29.03%) | Functions need tests | ⚠️ MEDIUM | 90%+ |

---

## 🎯 Test Coverage Strategy

### Phase 1: Critical Coverage Gaps (tag-input.tsx) ✅
**Target:** 0% → 80%+ coverage  
**Estimated Tests:** 12-15 tests  
**Time Estimate:** 1.5-2 hours

**Test Scenarios:**
1. **Rendering & Basic Interaction**
   - [ ] Renders input with placeholder
   - [ ] Shows available tags in popover
   - [ ] Displays character count indicator
   - [ ] Shows max tags warning when limit reached

2. **Tag Addition**
   - [ ] Adds tag on Enter key
   - [ ] Adds tag on comma input
   - [ ] Trims whitespace from tags
   - [ ] Prevents empty tags
   - [ ] Prevents duplicate tags (case-insensitive)

3. **Validation**
   - [ ] Enforces max tag length (20 chars)
   - [ ] Enforces max tags limit (5 tags)
   - [ ] Shows error for too-long tags
   - [ ] Shows error when max tags reached

4. **Autocomplete**
   - [ ] Filters available tags based on input
   - [ ] Shows top 5 suggestions max
   - [ ] Selects tag on suggestion click
   - [ ] Hides already-added tags from suggestions

5. **Edge Cases**
   - [ ] Handles backspace to clear input
   - [ ] Prevents adding when validation fails
   - [ ] Updates character count dynamically

---

### Phase 2: UI Component Coverage (conversation-tags.tsx) ✅
**Target:** 17.97% → 80%+ coverage  
**Estimated Tests:** 10-12 tests  
**Time Estimate:** 1-1.5 hours

**Test Scenarios:**
1. **Display & Rendering**
   - [ ] Renders tag badges with correct text
   - [ ] Applies consistent hash-based colors
   - [ ] Shows remove button when not readonly
   - [ ] Hides remove button in readonly mode
   - [ ] Renders with different sizes (sm, default)

2. **Interaction**
   - [ ] Calls onRemoveTag when X clicked
   - [ ] Calls onTagClick when tag clicked
   - [ ] Does not trigger onClick in readonly mode
   - [ ] Shows correct hover states

3. **Color System**
   - [ ] Same tag always gets same color
   - [ ] Different tags get different colors
   - [ ] Uses all 12 colors from palette

---

### Phase 3: Filter Component (tag-filter.tsx) ✅
**Target:** 75.4% → 85%+ coverage  
**Estimated Tests:** 8-10 tests  
**Time Estimate:** 1 hour

**Test Scenarios:**
1. **Tag Selection**
   - [ ] Shows all available tags with counts
   - [ ] Toggles tag selection on checkbox click
   - [ ] Shows checkmark for selected tags
   - [ ] Updates active filter count

2. **Clear Filters**
   - [ ] Shows "Clear all" button when filters active
   - [ ] Calls onClearFilters when clicked
   - [ ] Hides "Clear all" when no filters

3. **Dropdown Interaction**
   - [ ] Opens popover on button click
   - [ ] Closes popover after selection
   - [ ] Shows tag counts in format "tagname (count)"

---

### Phase 4: Conversation Title (conversation-title.tsx) ✅
**Target:** 57.02% → 75%+ coverage  
**Estimated Tests:** 6-8 tests  
**Time Estimate:** 45 minutes

**Test Scenarios:**
1. **Edit Mode**
   - [ ] Shows title text in view mode
   - [ ] Switches to input on edit click
   - [ ] Saves on Enter key
   - [ ] Saves on blur
   - [ ] Cancels on Escape key

2. **Validation**
   - [ ] Prevents saving empty titles
   - [ ] Trims whitespace
   - [ ] Reverts to original on cancel

---

### Phase 5: Conversation History Functions (conversation-history.tsx) ✅
**Target:** 85.84% (funcs 29.03%) → 90%+ coverage  
**Estimated Tests:** 8-10 tests  
**Time Estimate:** 1 hour

**Test Scenarios:**
1. **Tag Management**
   - [ ] Adds tag to conversation
   - [ ] Removes tag from conversation
   - [ ] Toggles tag filter selection
   - [ ] Clears all tag filters

2. **Filtering**
   - [ ] Filters conversations by selected tags
   - [ ] Combines tag filters with search
   - [ ] Shows correct filter count badge
   - [ ] Shows empty state when no matches

---

## 📋 Implementation Checklist

### Pre-Implementation
- [x] Create feature branch `feat/increase-test-coverage-to-65`
- [x] Analyze current coverage gaps
- [x] Create implementation plan document
- [ ] Set up todo list for tracking

### Phase 1: tag-input.tsx Tests
- [ ] Write test file: `src/__tests__/components/tag-input.test.tsx`
- [ ] TDD: Write failing tests first (RED)
- [ ] Verify tests pass with current implementation (GREEN)
- [ ] Refactor if needed
- [ ] Run coverage: verify 80%+
- [ ] Commit: "test: add comprehensive tests for tag-input component"

### Phase 2: conversation-tags.tsx Tests
- [ ] Write test file: `src/__tests__/components/conversation-tags.test.tsx`
- [ ] TDD: Write failing tests first (RED)
- [ ] Verify tests pass (GREEN)
- [ ] Run coverage: verify 80%+
- [ ] Commit: "test: add comprehensive tests for conversation-tags component"

### Phase 3: tag-filter.tsx Tests
- [ ] Enhance existing or create new test file
- [ ] Add missing test scenarios
- [ ] Run coverage: verify 85%+
- [ ] Commit: "test: increase tag-filter coverage to 85%+"

### Phase 4: conversation-title.tsx Tests
- [ ] Write test file: `src/__tests__/components/conversation-title.test.tsx`
- [ ] Cover edit mode, validation, keyboard shortcuts
- [ ] Run coverage: verify 75%+
- [ ] Commit: "test: add tests for conversation-title component"

### Phase 5: conversation-history.tsx Tests
- [ ] Enhance existing test file
- [ ] Add tests for tag management functions
- [ ] Run coverage: verify 90%+ (functions 50%+)
- [ ] Commit: "test: increase conversation-history function coverage"

### Final Steps
- [ ] Run full test suite: `npm test -- --no-watch`
- [ ] Run coverage report: `npm run test:coverage`
- [ ] Verify 65%+ overall coverage achieved
- [ ] Update README.md metrics
- [ ] Update this document with final results
- [ ] Create PR with comprehensive description

---

## 🎯 Success Criteria

### Coverage Targets
- ✅ Overall statement coverage: **65%+** (from 57.67%)
- ✅ Overall branch coverage: **75%+** (from 74.9%)
- ✅ Overall function coverage: **50%+** (from 42%)

### Quality Targets
- ✅ All new tests follow TDD methodology
- ✅ All tests pass (0 failures, 0 skipped)
- ✅ No breaking changes to existing tests
- ✅ Tests are readable and maintainable
- ✅ Mock data properly organized
- ✅ Edge cases covered

### Documentation Targets
- ✅ Implementation plan completed (this doc)
- ✅ README.md metrics updated
- ✅ Test files have descriptive comments
- ✅ Commit messages follow convention

---

## 📈 Expected Coverage Improvements

### Before (Baseline)
```
All files:                57.67% statements
                         74.9% branches
                         42% functions

Critical gaps:
- tag-input.tsx:         0% coverage
- conversation-tags.tsx: 17.97% coverage
- tag-filter.tsx:        75.4% coverage
```

### After (Target)
```
All files:                65%+ statements (+7.33%)
                         75%+ branches (+0.1%)
                         50%+ functions (+8%)

Improved files:
- tag-input.tsx:         80%+ coverage (+80%)
- conversation-tags.tsx: 80%+ coverage (+62%)
- tag-filter.tsx:        85%+ coverage (+9.6%)
- conversation-title.tsx: 75%+ coverage (+18%)
```

---

## 🧪 Testing Best Practices

### TDD Workflow (Red-Green-Refactor)
1. **RED:** Write failing test first
2. **GREEN:** Verify test passes with current code
3. **REFACTOR:** Improve test clarity if needed

### Test Organization
```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders with correct props', () => {});
  });
  
  describe('User Interaction', () => {
    it('handles click events', () => {});
  });
  
  describe('Edge Cases', () => {
    it('handles invalid input', () => {});
  });
});
```

### Mock Strategy
- Use existing mocks from `src/__tests__/__mocks__/`
- Create component-specific mocks when needed
- Mock external dependencies (hooks, utilities)
- Keep mocks simple and focused

---

## 📝 Notes

### Why These Files?
1. **tag-input.tsx** (0% coverage) - Largest coverage gap, critical user input component
2. **conversation-tags.tsx** (17.97%) - Core UI component with low coverage
3. **tag-filter.tsx** (75.4%) - Good coverage but missing edge cases
4. **conversation-title.tsx** (57.02%) - Edit functionality untested
5. **conversation-history.tsx** (functions 29%) - Complex functions need coverage

### Why 65% Target?
- Current: 57.67%
- Reasonable gain: +7.33%
- Industry standard: 60-80%
- Matches branch coverage: 75%
- Achievable in 5-6 hours of focused work

### Why TDD?
- Ensures tests are meaningful (not just coverage gaming)
- Catches bugs early
- Improves code design
- Documents expected behavior
- Builds confidence in refactoring

---

## 🚀 Next Steps After 65%

Once 65% coverage is achieved:

1. **Consider 70% target** for next iteration
2. **Add snapshot tests** for UI components
3. **Increase E2E coverage** for new features
4. **Add integration tests** for tag + search interaction
5. **Performance testing** for large conversation lists

---

**Status:** 🟡 In Progress  
**Last Updated:** October 31, 2025  
**Next Milestone:** Complete Phase 1 (tag-input.tsx tests)
