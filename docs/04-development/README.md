# Development Guide

## 👨‍💻 Contributing to DocuNote

This guide covers everything you need to contribute to the project.

---

## 🚀 Getting Started

### Prerequisites
1. Read [Getting Started Guide](../01-getting-started/README.md)
2. Set up your development environment
3. Check [Project Blueprint](../01-getting-started/blueprint.md)

### Development Setup
```bash
# Clone and install
git clone <repo>
cd DocuNote
npm install

# Set up environment
cp .env.example .env.local
# Add your API keys

# Start dev server
npm run dev
```

---

## 📋 Development Workflow

### 1. Check for Known Issues
Before starting, check **[Dev Issue Log](./dev-issue-log.md)** for:
- Known bugs
- Common problems
- Workarounds

### 2. Create a Branch
```bash
# Feature branches
git checkout -b feature/your-feature-name

# Bug fix branches
git checkout -b fix/bug-description
```

### 3. Develop and Test
```bash
# Make your changes
# ...

# Run tests
npm test                  # Jest
npm run test:e2e          # Playwright
npm run test:coverage     # Coverage
```

### 4. Document Your Work
- Update docs in `docs/`
- Add feature docs in `docs/03-features/` if applicable
- Update `README.md` if needed
- Document new issues in `dev-issue-log.md`

### 5. Commit Your Changes
Follow the **[Git Commit Guide](./git-commit-guide.md)** for:
- Commit message format
- How to organize changes
- Best practices

### 6. Create Pull Request
```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub
```

---

## 📝 Daily Logs

We track development work in daily logs for context and progress:

### Daily Log Types
- **[Daily Logs Directory](../daily-logs/README.md)** - Overview and templates
- **Summary** - End of day accomplishments and metrics
- **Sessions** - Detailed session notes and decisions
- **Analysis** - In-depth project reviews

### Current Logs (Oct 7, 2025)
- [Daily Summary](../daily-logs/2025-10-07-summary.md) - Today's work
- [Session Notes](../daily-logs/2025-10-07-sessions.md) - Development sessions
- [Project Analysis](../daily-logs/2025-10-07-analysis.md) - Comprehensive review

### When to Update
Add entries when:
- Completing a development day (summary)
- Making important decisions (sessions)
- Solving complex problems (sessions)
- Conducting project reviews (analysis)

---

## 🐛 Issue Management

### Reporting Issues
When you encounter a bug:

1. **Check** [Dev Issue Log](./dev-issue-log.md) to see if it's known
2. **Document** the issue:
   - Description
   - Steps to reproduce
   - Expected vs actual behavior
   - Workaround (if any)
3. **Update** the dev issue log
4. **Create GitHub issue** if needed

### Known Issues
See **[Dev Issue Log](./dev-issue-log.md)** for:
- Active bugs
- Resolved issues
- Workarounds

---

## 🧪 Testing Requirements

### Before Committing
- [ ] All Jest tests pass (`npm test`)
- [ ] No ESLint errors
- [ ] TypeScript compiles
- [ ] Code follows project conventions

### Before Creating PR
- [ ] E2E tests pass (relevant ones)
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] No console errors/warnings

See [Testing Guide](../02-testing/README.md).

---

## 📚 Code Standards

### TypeScript
- Use strict type checking
- Avoid `any` types
- Document complex types

### React Components
- Functional components with hooks
- Props interfaces defined
- Proper error boundaries

### File Organization
```
src/
├── app/          # Next.js pages
├── components/   # Reusable components
├── ai/          # AI integration
├── lib/         # Utilities
└── hooks/       # Custom hooks
```

### Naming Conventions
- **Components:** PascalCase (`ChatHeader.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Hooks:** camelCase with 'use' (`useChat.ts`)
- **Tests:** Same as file + `.test.tsx` or `.spec.ts`

---

## 🔄 Git Best Practices

### Commit Messages
See [Git Commit Guide](./git-commit-guide.md) for detailed instructions.

**Format:**
```
type(scope): brief description

- Detailed change 1
- Detailed change 2
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Code refactoring
- `chore`: Maintenance

### Branching Strategy
- `main` - Production-ready
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation

---

## 🆘 Getting Help

### Resources
1. **Documentation** - Check `docs/` folder
2. **Issue Log** - [dev-issue-log.md](./dev-issue-log.md)
3. **Testing Guide** - [Testing docs](../02-testing/README.md)
4. **Blueprint** - [Project vision](../01-getting-started/blueprint.md)

### Common Problems
- Build errors → [Installation Warnings](../01-getting-started/installation-warnings.md)
- Test failures → [Test Cleanup Summary](../02-testing/test-cleanup-summary.md)
- Feature questions → [Features docs](../03-features/README.md)

---

## 🎯 Next Steps

Ready to contribute?

1. ✅ Read this guide
2. ✅ Set up your environment
3. ✅ Pick an issue or feature
4. ✅ Follow the workflow above
5. ✅ Submit your PR!

**Happy coding! 🚀**
