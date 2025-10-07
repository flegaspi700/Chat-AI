# FileChat AI

An intelligent chat application built with Next.js 15 and Google Genkit that allows you to get insights from your documents and websites. Upload files or provide URLs and start asking questions!

## ✨ Features

- **💬 Conversational AI Chat:** Interact with Google Gemini 2.5 Flash to ask questions and get information from your provided sources
- **📄 File Uploads:** Upload and process both `.txt` and `.pdf` files to use as a knowledge base
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

### ✅ What's Working (Oct 7, 2025)

- **Chat Interface** - Full conversational AI with context from sources
- **File Upload** - `.txt` and `.pdf` file processing
- **URL Scraping** - Website content extraction
- **Source Management** - Add/remove files and URLs
- **Theme System** - Dark/light mode + AI-generated themes
- **Testing** - 65+ tests, 42% coverage

### 🚧 Known Limitations

- No chat history persistence (page refresh clears conversation)
- No user authentication (single-user local app)
- No response streaming (full response wait)
- Mobile responsive layout needs refinement
- Limited to 2 file types (txt, pdf)

See **[Development Issue Log](./docs/04-development/dev-issue-log.md)** for detailed status.

---

## 🔮 Next Steps & Roadmap

### High Priority (Production Ready)
1. **Persist Sources & Themes** - Save to localStorage for session persistence
2. **Streaming Responses** - Token-by-token AI response streaming
3. **Mobile Responsive Layout** - Improved mobile sidebar and layout
4. **Error Boundaries** - Better error handling and fallback UI
5. **Input Validation** - File size limits and content validation

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

## 📊 Project Metrics (Oct 7, 2025)

- **Lines of Code:** ~2,000+ lines (production)
- **Documentation:** ~4,000+ lines (comprehensive)
- **Tests:** 65+ tests across Jest and Playwright
- **Test Coverage:** 42% statements, 57% branches
- **Components:** 30+ reusable UI components
- **AI Flows:** 5 Genkit flows

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

**Last Updated:** October 7, 2025
