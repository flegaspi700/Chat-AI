# Future Work & Known Issues

## 🔧 Active Issues

### Debug Gemini 2.5 Flash Image Generation
**Status**: API integration complete, theme colors + persistence working ✅  
**Issue**: Images generate successfully (base64 ~2MB) but need user testing to verify  
**What We Fixed**:
- ✅ QuotaExceededError by stripping images from localStorage
- ✅ Theme color persistence across page reloads
- ✅ Gradient fallback system works perfectly

**What Needs Testing**:
1. Test with user's API key to verify image generation works
2. Review console logs for:
   - `Gemini API Response: { ... }` (full API response)
   - `✅ Image generated successfully: image/png 150000 bytes` (success)
   - OR `⚠️ Gemini generated no images` (failure)
3. If images don't generate, check:
   - API key permissions
   - Gemini API quotas
   - Region availability for gemini-2.5-flash-image

**Current Behavior**:
- Theme colors persist perfectly ✅
- Gradient backgrounds work as fallback ✅
- No localStorage quota errors ✅
- Can save multiple themes/conversations ✅

**Related Commits**:
- `eaeb02c` - Theme persistence + image generation debugging
- `e2e1362` - Comprehensive testing guide
- `58d7bbb` - LocalStorage quota fix

**Documentation**:
- `docs/gemini-image-implementation.md` - Full API documentation
- `docs/testing-ai-theme-generation.md` - Testing procedures + debugging

---

## 📋 Planned Enhancements

### Document Testing Patterns
Create a testing guide documenting the patterns established:
- TooltipProvider wrapper
- ResizeObserver mock
- Console suppression
- Module mocking strategies
- User event testing approaches

### Add Tests for Remaining Components
Continue improving coverage for components below 80%:
- ai-theme-generator (50.3%)
- chat-messages (81.31%)
- conversation-title (50.94%)
- theme-toggle-button (86.88%)
- UI components

### Add E2E Tests for Critical User Flows
Enhance Playwright E2E test coverage:
- File upload → AI summary → conversation save → conversation load workflow
- Theme generation → persistence → reload verification
- Multi-file upload scenarios

---

## ⚠️ Deprecated/Disabled Features

### Imagen 3 Image Generation (Disabled)
**Reason**: Requires Vertex AI (GCP with billing setup)  
**Current Solution**: Using Gemini 2.5 Flash Image instead  
**Options for Future**:
- A) Vertex AI integration (requires GCP billing)
- B) Alternative APIs (Pexels/Pixabay for stock images)
- C) Keep gradients (current, works well)

**Last Updated**: October 20, 2025
