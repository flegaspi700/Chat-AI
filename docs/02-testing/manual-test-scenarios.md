# Manual Test Scenarios for NoteChat-AI

## Test Execution Checklist

Use this checklist to manually validate the application before releases.

---

## 📝 Test Scenario 1: Basic File Upload and Q&A

**Objective**: Verify users can upload a text file and ask questions about it.

**Prerequisites**:
- Application running on http://localhost:9002
- Test file: `test-files/sample-article.txt` available

**Steps**:
1. Open application in browser
2. Click sidebar toggle/hamburger menu
3. Click "Upload File" or similar button
4. Select `sample-article.txt`
5. Wait for file to appear in sidebar
6. In chat input, type: "When was the term artificial intelligence coined?"
7. Press Enter or click Send

**Expected Results**:
- ✅ File appears in sidebar with correct name
- ✅ File icon shows it's a text file
- ✅ Question appears in chat as user message
- ✅ AI response appears mentioning "1956" and "John McCarthy"
- ✅ Response time < 10 seconds
- ✅ No error messages

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 2: PDF File Upload

**Objective**: Verify PDF files can be parsed and queried.

**Prerequisites**:
- Convert `machine-learning-guide.html` to PDF OR download a sample PDF
- Application running

**Steps**:
1. Open sidebar
2. Upload a PDF file
3. Wait for processing (may take 10-30 seconds)
4. Ask: "What types of machine learning are there?"

**Expected Results**:
- ✅ PDF file appears in sidebar
- ✅ Processing indicator shown during upload
- ✅ AI answers mentioning supervised, unsupervised, reinforcement learning
- ✅ Content correctly extracted from PDF

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 3: URL Scraping (Simple)

**Objective**: Scrape a simple, scraping-friendly website.

**Prerequisites**:
- Application running
- Internet connection

**Steps**:
1. Open sidebar
2. Find URL input field
3. Enter: `http://quotes.toscrape.com/`
4. Click "Add URL" or similar
5. Wait for scraping to complete
6. Ask: "What are some quotes on this page?"

**Expected Results**:
- ✅ URL appears in sources list
- ✅ Title shows "Quotes to Scrape" or similar
- ✅ Scraping completes in < 5 seconds
- ✅ AI response mentions Einstein, Rowling, or specific quotes
- ✅ No error toast

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 4: Invalid URL Handling

**Objective**: Verify graceful error handling for invalid URLs.

**Prerequisites**:
- Application running

**Steps**:
1. Open sidebar
2. Enter invalid URL: `not-a-valid-url`
3. Click "Add URL"
4. Observe behavior

**Expected Results**:
- ✅ Error toast appears
- ✅ Error message is clear and helpful
- ✅ URL not added to sources list
- ✅ Application remains stable
- ✅ User can try again

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 5: Multiple Sources

**Objective**: Use multiple files and URLs simultaneously.

**Prerequisites**:
- `sample-article.txt` and `company-policies.txt` available
- Application running

**Steps**:
1. Upload `sample-article.txt`
2. Upload `company-policies.txt`
3. Add URL: `http://quotes.toscrape.com/`
4. Verify all 3 sources in sidebar
5. Ask: "What information do I have in my sources?"

**Expected Results**:
- ✅ All 3 sources visible in sidebar
- ✅ Different icons for files vs URLs
- ✅ AI acknowledges all sources in response
- ✅ Can reference content from each source

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 6: Remove Source

**Objective**: Verify users can remove sources from their list.

**Prerequisites**:
- At least one source uploaded

**Steps**:
1. Upload a file or add a URL
2. Locate remove/delete button (usually X icon)
3. Click remove button
4. Confirm if prompted

**Expected Results**:
- ✅ Source disappears from sidebar
- ✅ Smooth animation/transition
- ✅ Confirmation if needed
- ✅ AI no longer uses that source in responses

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 7: Empty Message Prevention

**Objective**: Ensure empty messages cannot be sent.

**Prerequisites**:
- Application running

**Steps**:
1. Click in chat input
2. Type only spaces: "     "
3. Press Enter

**Expected Results**:
- ✅ Message not sent
- ✅ Input cleared or no action taken
- ✅ No API call made
- ✅ No error message needed

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 8: Loading States

**Objective**: Verify loading indicators work correctly.

**Prerequisites**:
- Source uploaded
- Application running

**Steps**:
1. Ask a question
2. Immediately observe UI
3. Watch for loading indicators

**Expected Results**:
- ✅ Input disabled while loading
- ✅ Loading skeleton or spinner appears
- ✅ User cannot send another message while loading
- ✅ Loading state clears when response arrives

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 9: Conversation History

**Objective**: Verify conversation persists during session.

**Prerequisites**:
- Source uploaded

**Steps**:
1. Ask: "What is AI?"
2. Wait for response
3. Ask: "When was it founded?"
4. Wait for response
5. Ask: "Who were the pioneers?"
6. Scroll up to see all messages

**Expected Results**:
- ✅ All questions visible in order
- ✅ All AI responses visible
- ✅ Messages stay visible when scrolling
- ✅ Clear distinction between user and AI messages
- ✅ Later questions can reference earlier context

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 10: Dark/Light Mode Toggle

**Objective**: Verify theme switching works.

**Prerequisites**:
- Application running

**Steps**:
1. Locate theme toggle button
2. Note current theme (dark or light)
3. Click theme toggle
4. Observe changes

**Expected Results**:
- ✅ Theme switches smoothly
- ✅ All components update colors
- ✅ Text remains readable
- ✅ Icons update appropriately
- ✅ Consistent theme across all UI elements

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 11: AI Theme Generation

**Objective**: Test custom theme generation feature.

**Prerequisites**:
- Application running
- Settings menu accessible

**Steps**:
1. Open settings menu
2. Find theme generation option
3. Enter prompt: "ocean sunset with warm colors"
4. Click generate
5. Wait for theme to apply

**Expected Results**:
- ✅ Theme generation completes in < 5 seconds
- ✅ Colors change to match prompt
- ✅ Theme is visually pleasing
- ✅ All UI elements update
- ✅ No console errors

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 12: Mobile Responsiveness

**Objective**: Verify mobile layout works correctly.

**Prerequisites**:
- Application running
- Browser dev tools (F12)

**Steps**:
1. Open browser DevTools (F12)
2. Toggle device toolbar
3. Select iPhone or Pixel viewport
4. Test all major features

**Expected Results**:
- ✅ Sidebar collapses/hamburger menu shown
- ✅ Chat messages stack properly
- ✅ Input remains accessible
- ✅ Buttons are touch-friendly (min 44px)
- ✅ No horizontal scrolling
- ✅ Text is readable (min 16px)

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 13: Large Document Handling

**Objective**: Test with large documents.

**Prerequisites**:
- Large PDF or long text file (5+ pages)

**Steps**:
1. Upload large file
2. Wait for processing
3. Ask questions about content from beginning, middle, and end

**Expected Results**:
- ✅ File uploads successfully
- ✅ Processing completes (may take 30s)
- ✅ AI can answer questions from entire document
- ✅ No timeout errors
- ✅ Performance remains acceptable

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 14: No Sources State

**Objective**: Verify appropriate messaging when no sources exist.

**Prerequisites**:
- Application freshly loaded
- No sources added

**Steps**:
1. Open application
2. Observe main chat area
3. Try to ask a question

**Expected Results**:
- ✅ Empty state message shown
- ✅ Guidance to upload files or add URLs
- ✅ Clear call-to-action
- ✅ Professional, helpful tone

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 15: Browser Compatibility

**Objective**: Test in multiple browsers.

**Prerequisites**:
- Application running
- Access to Chrome, Firefox, Safari, or Edge

**Steps**:
1. Open application in Chrome
2. Test basic upload and chat
3. Repeat in Firefox
4. Repeat in Edge (if available)

**Expected Results**:
- ✅ Works in Chrome 90+
- ✅ Works in Firefox 88+
- ✅ Works in Edge 90+
- ✅ Consistent appearance across browsers
- ✅ No browser-specific bugs

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📝 Test Scenario 16: Error Recovery

**Objective**: Verify application recovers from errors.

**Prerequisites**:
- Application running

**Steps**:
1. Trigger an error (invalid URL, network disconnect, etc.)
2. Observe error handling
3. Attempt to continue using app

**Expected Results**:
- ✅ Error message is clear
- ✅ Error doesn't crash the app
- ✅ User can dismiss error
- ✅ Can continue using app after error
- ✅ Error logged to console for debugging

**Pass/Fail**: ☐

**Notes**: _______________________________________________________________

---

## 📊 Test Summary

**Date**: _______________
**Tester**: _______________
**Version**: _______________
**Environment**: _______________

| Scenario | Pass | Fail | Skip | Notes |
|----------|------|------|------|-------|
| 1. Basic File Upload | ☐ | ☐ | ☐ | |
| 2. PDF Upload | ☐ | ☐ | ☐ | |
| 3. URL Scraping | ☐ | ☐ | ☐ | |
| 4. Invalid URL | ☐ | ☐ | ☐ | |
| 5. Multiple Sources | ☐ | ☐ | ☐ | |
| 6. Remove Source | ☐ | ☐ | ☐ | |
| 7. Empty Message | ☐ | ☐ | ☐ | |
| 8. Loading States | ☐ | ☐ | ☐ | |
| 9. Conversation History | ☐ | ☐ | ☐ | |
| 10. Theme Toggle | ☐ | ☐ | ☐ | |
| 11. AI Theme Gen | ☐ | ☐ | ☐ | |
| 12. Mobile | ☐ | ☐ | ☐ | |
| 13. Large Docs | ☐ | ☐ | ☐ | |
| 14. No Sources | ☐ | ☐ | ☐ | |
| 15. Browser Compat | ☐ | ☐ | ☐ | |
| 16. Error Recovery | ☐ | ☐ | ☐ | |

**Total Passed**: _____ / 16
**Total Failed**: _____
**Total Skipped**: _____

**Overall Assessment**: ☐ Ready for Release  ☐ Needs Work  ☐ Critical Issues

**Critical Issues Found**:
1. _____________________________________________________________________
2. _____________________________________________________________________
3. _____________________________________________________________________

**Recommendations**:
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

---

**Signature**: _______________  **Date**: _______________
