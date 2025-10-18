# 🐛 CI Workflow Troubleshooting Guide

## Common Issues and Solutions

---

## ✅ Workflow Completed Successfully!

If your CI passed, you'll see:
```
✓ CI / Code Quality & Tests
  Successful in 2m 35s
```

**Great!** Everything is working. No action needed.

---

## ❌ Common Failures and How to Fix

### **1. Type Check Failed**

#### **What You'll See:**
```
❌ Type check
Error: src/app/page.tsx:42:18 - error TS2339: 
Property 'name' does not exist on type 'User'.
```

#### **What It Means:**
TypeScript found a type error in your code.

#### **How to Fix:**
```bash
# Run type check locally
npm run typecheck

# Fix the errors shown
# Then commit and push
```

---

### **2. Lint Failed**

#### **What You'll See:**
```
❌ Lint code
Error: 'x' is defined but never used. (no-unused-vars)
```

#### **What It Means:**
ESLint found code quality issues.

#### **How to Fix:**
```bash
# Run lint locally
npm run lint

# Auto-fix what can be fixed
npm run lint -- --fix

# Fix remaining issues manually
# Then commit and push
```

---

### **3. Tests Failed**

#### **What You'll See:**
```
❌ Run tests
FAIL src/__tests__/app/page.test.tsx
  ✓ renders main page
  ✕ handles user input
```

#### **What It Means:**
One or more tests are failing.

#### **How to Fix:**
```bash
# Run tests locally
npm run test

# See detailed output
# Fix the failing tests
# Then commit and push
```

---

### **4. Build Failed**

#### **What You'll See:**
```
❌ Build application
Error: Module not found: Can't resolve './missing-file'
```

#### **What It Means:**
Production build failed (missing import, syntax error, etc.)

#### **How to Fix:**
```bash
# Run build locally
npm run build

# Fix the errors shown
# Then commit and push
```

---

## 🔍 How to Debug

### **Step 1: Click on the Failed Step**
In GitHub Actions, click the red X to expand the failed step.

### **Step 2: Read the Error Message**
Look for the actual error (usually near the bottom).

### **Step 3: Reproduce Locally**
Run the same command on your machine:
```bash
npm run typecheck  # or lint, test, build
```

### **Step 4: Fix and Push**
```bash
# Fix the issue
# Test locally
npm run typecheck
npm run lint
npm run test

# Commit and push
git add .
git commit -m "fix: resolve CI errors"
git push origin main
```

---

## ⚠️ Workflow Didn't Run at All

### **Possible Reasons:**

#### **1. Workflow File Not in Correct Location**
**Check:** File must be at `.github/workflows/ci.yml`
```bash
ls .github/workflows/ci.yml
```

#### **2. YAML Syntax Error**
**Check:** Validate YAML syntax
- Copy your ci.yml content
- Paste into: https://www.yamllint.com/
- Fix any syntax errors

#### **3. Wrong Branch**
**Check:** Workflow only runs on `main` branch
```bash
git branch  # Verify you're on main
```

#### **4. Not Pushed Yet**
**Check:** Changes must be pushed to GitHub
```bash
git status
git push origin main
```

---

## 🐌 Workflow Running Very Slow

### **Normal Duration: 2-3 minutes**

### **If Taking 5+ Minutes:**

#### **1. Cache Not Working**
**Solution:** Cache should work on second run automatically

#### **2. Large Dependencies**
**Normal:** First run always slower (installing all packages)

#### **3. Check GitHub Status**
Visit: https://www.githubstatus.com/

---

## 🔐 Secrets Issues

### **If Build Needs API Key:**

#### **Current Setup:**
```yaml
GOOGLE_GENAI_API_KEY: ${{ secrets.GOOGLE_GENAI_API_KEY || 'dummy-key-for-build' }}
```

This uses dummy key if secret not set (safe for builds).

#### **To Add Real Secret (Optional):**
1. Go to: Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GOOGLE_GENAI_API_KEY`
4. Value: Your actual API key
5. Save

---

## 📧 Notification Settings

### **Too Many Emails?**

#### **Configure Notifications:**
1. GitHub → Settings → Notifications
2. Scroll to "Actions"
3. Choose:
   - Only failures
   - Only on @mention
   - Never

---

## 🔄 Re-run Failed Workflow

### **If You Think It Was a Fluke:**

1. Go to the failed workflow run
2. Click "Re-run jobs" → "Re-run failed jobs"
3. Watch it run again

---

## 📊 Viewing Coverage Report

### **Coverage Report Not Uploading?**

#### **Check:**
```yaml
- name: Upload coverage report
  uses: actions/upload-artifact@v4
  if: always()  # ← This ensures it uploads even if tests fail
```

#### **Download:**
1. Go to workflow run
2. Scroll to bottom
3. Look for "Artifacts" section
4. Click "coverage-report" to download

---

## 🚨 Emergency: Skip CI

### **If You Need to Push Without CI:**
```bash
git commit -m "docs: update README [skip ci]"
```

The `[skip ci]` flag tells GitHub to skip the workflow.

**⚠️ Use sparingly!** Only for documentation changes.

---

## ✅ Verification Checklist

If CI isn't working, check:

- [ ] File at `.github/workflows/ci.yml`
- [ ] File committed to git
- [ ] File pushed to GitHub
- [ ] On `main` branch
- [ ] YAML syntax valid
- [ ] Node.js version correct (20)
- [ ] Scripts exist in package.json
- [ ] Dependencies in package.json

---

## 🆘 Still Stuck?

### **Get Help:**

#### **1. Check Workflow Logs**
Most errors show exactly what's wrong in the logs.

#### **2. Test Locally First**
Run all CI commands locally:
```bash
npm ci
npm run typecheck
npm run lint
npm run test:ci
npm run build
```

If they work locally, they should work in CI.

#### **3. Compare with Working Workflow**
Look at other successful runs to see what's different.

---

## 📚 Useful Commands

### **Test Everything Locally (Simulate CI):**
```bash
# Clean install (like CI does)
rm -rf node_modules
npm ci

# Run all checks (like CI does)
npm run typecheck
npm run lint
npm run test:ci
npm run build
```

### **Check Workflow Syntax:**
```bash
# Install yamllint (optional)
npm install -g yaml-lint

# Validate
yamllint .github/workflows/ci.yml
```

---

## 🎯 Success Criteria

Your CI is working correctly when:

- ✅ Workflow appears in Actions tab
- ✅ Runs automatically on push
- ✅ All 8 steps complete successfully
- ✅ Green checkmark on commit
- ✅ Badge shows "passing"
- ✅ Coverage report available
- ✅ Takes 2-3 minutes

---

## 💡 Pro Tips

### **1. Always Test Locally First**
```bash
npm run typecheck && npm run lint && npm run test
```

### **2. Watch the Logs**
Click on steps to see detailed output.

### **3. Use the Badge**
The README badge shows status at a glance.

### **4. Check Before Push**
```bash
# Quick check
npm run typecheck && npm run lint
```

---

## 🎉 You're All Set!

Most CI failures are easy to fix:
1. Read the error message
2. Run the command locally
3. Fix the issue
4. Push again

CI is your friend—it catches bugs before they reach production! 🚀
