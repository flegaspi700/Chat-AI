# 🚀 CI Workflow Guide

## What We Just Created

A **GitHub Actions CI workflow** that automatically tests your code on every push and pull request.

---

## 📁 File Location

```
.github/workflows/ci.yml
```

This special location tells GitHub to run this workflow automatically.

---

## 🎯 What Happens When You Push Code

### **Trigger Events**
The workflow runs when:
- ✅ You push to the `main` branch
- ✅ Someone creates a pull request to `main`
- ✅ Someone updates an existing pull request

### **Step-by-Step Process**

#### **Step 1: Checkout Code** 📥
```yaml
- uses: actions/checkout@v4
```
**What happens:** GitHub creates a fresh VM and clones your repository  
**Time:** ~5 seconds  
**You'll see:** "Checkout repository" in logs

#### **Step 2: Setup Node.js** 🟢
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```
**What happens:** Installs Node.js 20 and caches npm packages  
**Time:** ~10 seconds (faster on subsequent runs due to caching)  
**You'll see:** "Setup Node.js" in logs

#### **Step 3: Install Dependencies** 📦
```yaml
- run: npm ci
```
**What happens:** Installs all packages from package-lock.json  
**Time:** ~30-60 seconds  
**You'll see:** Full npm install output

#### **Step 4: Type Check** 🔍
```yaml
- run: npm run typecheck
```
**What happens:** Runs TypeScript compiler to check for type errors  
**Time:** ~10 seconds  
**Success:** ✅ "Found 0 errors"  
**Failure:** ❌ Shows exact type errors

#### **Step 5: Lint Code** 🧹
```yaml
- run: npm run lint
```
**What happens:** Runs ESLint to check code quality  
**Time:** ~5 seconds  
**Success:** ✅ "No ESLint warnings or errors"  
**Failure:** ❌ Shows linting errors

#### **Step 6: Run Tests** 🧪
```yaml
- run: npm run test:ci
```
**What happens:** Runs all Jest tests  
**Time:** ~20 seconds  
**Success:** ✅ "Tests: 52 passed, 13 skipped"  
**Failure:** ❌ Shows which tests failed

#### **Step 7: Build** 🏗️
```yaml
- run: npm run build
```
**What happens:** Creates production build  
**Time:** ~30-60 seconds  
**Success:** ✅ "Compiled successfully"  
**Failure:** ❌ Shows build errors

#### **Step 8: Upload Coverage** 📊
```yaml
- uses: actions/upload-artifact@v4
```
**What happens:** Saves test coverage report  
**Time:** ~5 seconds  
**Result:** Downloadable coverage report in GitHub

---

## 🖥️ What You'll See in GitHub

### **1. On Your Commit**
When you push:
```
feat: add new feature
↻ CI / test — In progress
```

After ~2-3 minutes:
```
feat: add new feature
✓ CI / test — Successful in 2m 35s
```

Or if something fails:
```
feat: add new feature
✗ CI / test — Failed in 1m 12s
```

### **2. In GitHub Actions Tab**
Navigate to: `https://github.com/flegaspi700/DocuNote/actions`

You'll see:
- 📊 All workflow runs
- ⏱️ Duration of each run
- ✅ Pass/fail status
- 📝 Detailed logs for each step
- 📥 Downloadable artifacts (coverage reports)

### **3. On Pull Requests**
When someone opens a PR:
```
Pull Request #42: Add dark mode

Checks:
✓ CI / test — Passed
```

The PR can't be merged until this check passes (optional setting).

---

## 🎬 Let's Test It!

### **Step 1: Commit and Push**
```bash
git add .github/workflows/ci.yml
git commit -m "feat: add GitHub Actions CI workflow"
git push origin main
```

### **Step 2: Watch It Run**
1. Go to: https://github.com/flegaspi700/DocuNote/actions
2. You'll see your workflow running in real-time
3. Click on it to see live logs

### **Step 3: See Results**
After 2-3 minutes, you'll see:
- ✅ All checks passed
- 📊 Coverage report available
- 🎉 Green checkmark on your commit

---

## 🔍 How to View Logs

### **In GitHub UI:**
1. Go to Actions tab
2. Click on the workflow run
3. Click on "Code Quality & Tests" job
4. Expand any step to see detailed output

### **What you'll see:**
```
Run npm run typecheck
> docunote@0.1.0 typecheck
> tsc --noEmit

✓ No type errors found
```

---

## 🚨 What Happens If Something Fails?

### **Scenario: Type Error**
```
❌ Type check
Error: src/app/page.tsx:42:18 - error TS2339: 
Property 'name' does not exist on type 'User'.
```

**Result:**
- ❌ Workflow fails immediately (doesn't continue to next steps)
- 📧 You get an email notification
- ❌ Red X appears on your commit
- 🚫 PR can't be merged (if you enable branch protection)

### **Scenario: Test Failure**
```
❌ Run tests
FAIL src/__tests__/app/page.test.tsx
  ✓ renders main page
  ✕ handles user input
```

**Result:**
- ❌ Workflow marked as failed
- 📝 Detailed test output in logs
- 🐛 You can debug using the logs

---

## ⚡ Performance & Speed

### **First Run:**
- Duration: ~3-4 minutes
- Installs everything from scratch

### **Subsequent Runs:**
- Duration: ~2-3 minutes
- Uses cached npm packages (faster!)

### **What Makes It Fast:**
```yaml
cache: 'npm'  # ← This caches node_modules
```

---

## 💰 Cost

### **For Your Public Repo:**
- ✅ **FREE** and **UNLIMITED**
- GitHub gives unlimited minutes for public repos

### **If It Were Private:**
- ✅ **FREE** for first 2,000 minutes/month
- Your workflow uses ~3 minutes per run
- = ~650 free runs per month

---

## 🎯 Benefits You Get Immediately

### **1. Catch Bugs Early**
```
Before: Push broken code → Users see errors 😱
Now: Push broken code → CI catches it → Fix before users see ✅
```

### **2. Confidence**
```
Before: "I hope I didn't break anything..." 😰
Now: "CI passed, I'm confident to merge" 😎
```

### **3. Code Reviews**
```
Before: Reviewer manually runs tests
Now: CI runs automatically, reviewer sees results instantly
```

### **4. Documentation**
```
Before: "Did you run the tests?"
Now: Green checkmark proves tests passed
```

---

## 🔐 About Secrets

### **Current Setup**
The workflow uses:
```yaml
GOOGLE_GENAI_API_KEY: ${{ secrets.GOOGLE_GENAI_API_KEY || 'dummy-key-for-build' }}
```

**What this means:**
- If you set the secret in GitHub, it uses it
- If not, it uses 'dummy-key-for-build' (safe for build step)

### **To Add Secrets (Optional):**
1. Go to: Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GOOGLE_GENAI_API_KEY`
4. Value: Your actual API key
5. Click "Add secret"

**Note:** For now, the dummy key works fine for builds!

---

## 📊 Next Steps After This Works

### **Level 1 (Current):** ✅ Basic CI
- Runs tests automatically
- Shows pass/fail status

### **Level 2:** Branch Protection
- Require CI to pass before merging
- Prevent broken code from reaching main

### **Level 3:** E2E Tests
- Add Playwright tests to CI
- Test full user flows

### **Level 4:** Deployment
- Auto-deploy when CI passes
- Deploy preview for PRs

---

## 🐛 Troubleshooting

### **Problem: Workflow doesn't run**
**Check:**
- File is in `.github/workflows/ci.yml`
- File is committed and pushed
- Branch name matches (main)

### **Problem: Build fails with "Cannot find module"**
**Solution:**
```yaml
- run: npm ci  # Make sure this step runs before build
```

### **Problem: Tests timeout**
**Solution:**
```yaml
- run: npm run test:ci
  timeout-minutes: 10  # Increase timeout
```

---

## 🎉 Summary

You now have:
- ✅ Automatic testing on every push
- ✅ Instant feedback on code quality
- ✅ Coverage reports saved automatically
- ✅ Protection against broken code
- ✅ Professional CI setup (industry standard)

**Next:** Let's push this and watch it run! 🚀
