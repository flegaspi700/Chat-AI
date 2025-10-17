# FileChat AI

An intelligent chat application built with Next.js 15 and Google Genkit that allows you to get insights from your documents and websites. Upload files or provide URLs and start asking questions!

## ✨ Features

- **💬 Conversational AI Chat:** Interact with Google Gemini 2.5 Flash to ask questions and get information from your provided sources
- **⚡ Streaming Responses:** Real-time AI response streaming with animated progress indicator
- **💾 Auto-Save Everything:** Messages, sources, and themes automatically persist across sessions
- **🔒 Input Validation:** Comprehensive security with file size limits, URL validation, and SSRF protection
- **🛡️ Error Boundaries:** Graceful error handling with recovery options - prevents app crashes
- **📱 Mobile Responsive:** Optimized for all devices with touch-friendly interactions and auto-close sidebar ✨ NEW
- **📄 File Uploads:** Upload and process both `.txt` and `.pdf` files (10MB limit) to use as a knowledge base
- **🌐 Website Scraping:** Provide any website URL, and the application will scrape its content to use as a source
- **📊 Source Management:** Clean sidebar interface to easily add, view, and remove your files and URL sources
- **🎨 AI-Powered Theme Generation:** Dynamically create and apply color themes based on a text prompt
- **🌙 Dark/Light Mode:** Quick theme toggle with keyboard shortcut (`Ctrl+Shift+T`)
- **📱 Responsive Design:** Modern, responsive UI that works across different screen sizes
- **✅ Fully Tested:** 65+ tests with Jest and Playwright (42% coverage)

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd NoteChat-AI
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    
    Create a `.env.local` file in the root directory:
    ```env
    GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    This will start the Next.js development server on [http://localhost:9002](http://localhost:9002).

5.  **Start building!** 🎉

### Quick Testing

Run the test suite to verify everything works:

```bash
# Unit and integration tests
npm test

# End-to-end tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

For detailed testing documentation, see **[TESTING-README.md](./TESTING-README.md)**.

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Getting Started Guide](./docs/01-getting-started/README.md)** - Project overview and setup
- **[Testing Documentation](./docs/02-testing/README.md)** - How to write and run tests
- **[Features Documentation](./docs/03-features/README.md)** - Feature implementation guides
- **[Development Guide](./docs/04-development/README.md)** - Contributing and workflow
- **[Daily Logs](./docs/daily-logs/README.md)** - Development progress tracking

**Start here:** [📖 Documentation Index](./docs/README.md)

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15.3.3](https://nextjs.org/)** - React framework with App Router
- **[React 18.3.1](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 3.4.1](https://tailwindcss.com/)** - Utility-first CSS
- **[ShadCN UI](https://ui.shadcn.com/)** - Component library (30+ components)
- **[next-themes 0.3.0](https://github.com/pacocoursey/next-themes)** - Theme management
- **[Lucide React](https://lucide.dev/)** - Icon library

### AI & Backend
- **[Google Genkit 1.20.0](https://firebase.google.com/docs/genkit)** - AI orchestration framework
- **[Google Gemini 2.5 Flash](https://ai.google.dev/)** - Large Language Model
- **[Cheerio 1.0.0](https://cheerio.js.org/)** - Server-side HTML parsing
- **[pdfjs-dist 4.5.136](https://mozilla.github.io/pdf.js/)** - PDF parsing

### Development & Testing
- **[Jest 30.2.0](https://jestjs.io/)** - Unit and integration testing
- **[Playwright 1.50.2](https://playwright.dev/)** - End-to-end testing
- **[React Testing Library 16.3.0](https://testing-library.com/react)** - Component testing
- **[Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)** - Fast development bundler

---

## 🎯 Project Status

### ✅ What's Working (Oct 17, 2025)

- **Chat Interface** - Full conversational AI with context from sources
- **Response Streaming** - Real-time token-by-token AI responses
- **Data Persistence** - Auto-save/restore messages, sources, and themes
- **Input Validation** - Comprehensive security and data validation
- **Error Boundaries** - Graceful error handling and crash prevention
- **Mobile Responsive** - Optimized for all devices (320px - 1920px+) ✨ NEW
- **File Upload** - `.txt` and `.pdf` file processing with size limits (10MB)
- **URL Scraping** - Website content extraction with SSRF protection
- **Source Management** - Add/remove files and URLs
- **Theme System** - Dark/light mode + AI-generated themes
- **Testing** - 65+ tests, 42% coverage

### 🚧 Known Limitations

- No user authentication (single-user local app)
- No swipe gestures for sidebar (future enhancement)
- Limited to 2 file types (txt, pdf - 10MB max)
- 5MB localStorage limit (can store ~1000 messages)
- Content limits (500K chars per file, 100K chars per message)

See **[Development Issue Log](./docs/04-development/dev-issue-log.md)** for detailed status.

---

## 🔮 Next Steps & Roadmap

### High Priority (Production Ready)
1. ~~**Persist Sources & Themes**~~ ✅ COMPLETED (Oct 13, 2025)
2. ~~**Streaming Responses**~~ ✅ COMPLETED (Oct 13, 2025)
3. ~~**Input Validation**~~ ✅ COMPLETED (Oct 13, 2025)
4. ~~**UI Layout Improvements**~~ ✅ COMPLETED (Oct 13, 2025)
5. ~~**Error Boundaries**~~ ✅ COMPLETED (Oct 13, 2025)
6. ~~**Mobile Responsive Layout**~~ ✅ COMPLETED (Oct 17, 2025)

### Medium Priority (Enhanced UX)
6. **Chat History** - Save and load past conversations
7. **Content Summaries** - AI-generated summaries for uploaded sources
8. **Export Conversations** - Download chat history as PDF/TXT
9. **Keyboard Shortcuts** - More productivity shortcuts
10. **Advanced Search** - Search within conversations

### Low Priority (Future Features)
11. **User Authentication** - Multi-user support with accounts
12. **More File Types** - `.docx`, `.csv`, `.md`, images support
13. **Multi-Model Support** - Switch between AI models
14. **Collaborative Features** - Share conversations, team workspaces
15. **Voice Integration** - Speech-to-text and text-to-speech

**See detailed roadmap:** [Daily Logs](./docs/daily-logs/2025-10-07-summary.md#next-steps-future-sessions)

---

## 🧪 Testing

This project has comprehensive test coverage:

- **Unit Tests:** Component and utility testing with Jest
- **Integration Tests:** AI flow testing with 92%+ coverage
- **E2E Tests:** Browser automation with Playwright

**Quick Commands:**
```bash
npm test                    # Run Jest tests
npm run test:e2e           # Run Playwright E2E tests
npm run test:coverage      # Generate coverage report
npx playwright show-report # View E2E test report
```

**Current Status:**
- 54 passing Jest tests, 11 skipped
- 2 passing E2E tests, 2 skipped
- 42% statement coverage, 57% branch coverage

For complete testing guide, see **[Testing Documentation](./docs/02-testing/README.md)**.

---

## 📖 Learn More

### Documentation
- **[Full Documentation](./docs/README.md)** - Complete documentation index
- **[Testing Guide](./TESTING-README.md)** - Quick testing reference
- **[Project Blueprint](./docs/01-getting-started/blueprint.md)** - Design vision
- **[Theme Toggle Feature](./docs/03-features/theme-toggle/)** - Feature example

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Genkit Documentation](https://firebase.google.com/docs/genkit)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🤝 Contributing

Contributions are welcome! Please see:

1. **[Development Guide](./docs/04-development/README.md)** - How to contribute
2. **[Git Commit Guide](./docs/04-development/git-commit-guide.md)** - Commit standards
3. **[Testing Guide](./docs/02-testing/README.md)** - How to write tests

**Development Workflow:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

---

## 📊 Project Metrics

| Metric | Value | Last Updated |
|--------|-------|--------------|
| **Lines of Code** | ~6,350+ lines | Oct 17, 2025 |
| **Documentation** | ~13,500+ lines | Oct 17, 2025 |
| **Tests** | 65+ tests | Oct 7, 2025 |
| **Test Coverage** | 42% statements, 57% branches | Oct 7, 2025 |
| **Components** | 30+ reusable UI components | Oct 13, 2025 |
| **AI Flows** | 5 Genkit flows | Oct 7, 2025 |
| **Custom Hooks** | 5 hooks | Oct 17, 2025 |

---

## 📝 License

This project is open source. See the LICENSE file for details.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) by Vercel
- [Google Genkit](https://firebase.google.com/docs/genkit) by Google
- [ShadCN UI](https://ui.shadcn.com/) by shadcn
- [Tailwind CSS](https://tailwindcss.com/) by Tailwind Labs

---

## 🆕 Recent Updates

### October 17, 2025
- ✅ **Mobile Responsive Layout** - Complete mobile optimization ✨ NEW
  - Auto-close sidebar after adding files/URLs on mobile
  - Touch-friendly interactions (44px minimum touch targets)
  - Responsive message bubbles (85% width on mobile)
  - Mobile-optimized padding and spacing
  - iOS Safari input zoom prevention (16px font-size)
  - Smooth momentum scrolling on iOS
  - Enhanced viewport and theme-color meta tags
  - Consistent focus states for accessibility
- 📚 **Documentation** - Added [mobile-responsive-layout.md](./docs/04-development/mobile-responsive-layout.md) (1000+ lines)

### October 13, 2025
- ✅ **Error Boundaries** - Graceful error handling with recovery
  - React Error Boundaries wrap critical sections
  - Custom fallback UI for different components
  - Error logging with localStorage persistence
  - Automatic recovery with resetKeys
  - Next.js error.tsx for SSR errors
  - Export error logs for debugging
- ✅ **UI Layout Improvements** - Better screen space utilization
  - Wider sidebar (20rem)
  - Centered content with max-width
  - Responsive padding (mobile to desktop)
  - Enhanced source cards with hover states
  - Better message bubble sizing
- ✅ **Input Validation** - Comprehensive validation with security features
  - File size limits (10MB max)
  - URL validation (SSRF/XSS protection)
  - Content length limits (500K chars)
  - Detailed error messages
- ✅ **Persistence Layer** - Auto-save messages, sources, and themes to localStorage
- ✅ **Response Streaming** - Real-time AI response with animated cursor
- ✅ **Clear Data Option** - Added "Clear All Data" in settings menu
- ✅ **Welcome Back Message** - Shows restored data count on load
- 📚 **Documentation** - Added [error-handling.md](./docs/04-development/error-handling.md), [input-validation.md](./docs/04-development/input-validation.md), and [persistence-streaming-implementation.md](./docs/04-development/persistence-streaming-implementation.md)

### October 7, 2025
- ✅ **Testing Infrastructure** - Jest + Playwright setup (65+ tests)
- ✅ **Theme Toggle** - Quick toggle with Ctrl+Shift+T shortcut
- ✅ **Documentation Reorganization** - 31 files, ~9,000 lines organized

---

**Last Updated:** October 17, 2025
