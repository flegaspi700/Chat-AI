# Common Installation Warnings & Solutions

## 📋 Expected Warnings (Safe to Ignore)

### 1. Peer Dependency Warnings

**Warning Example:**
```
npm WARN ERESOLVE overriding peer dependency
npm WARN While resolving: @testing-library/react@16.3.0
npm WARN Found: react@18.3.1
```

**Explanation**: This is normal. Testing Library is compatible with React 18.x.
**Action**: ✅ Safe to ignore

---

### 2. Deprecated Packages

**Warning Example:**
```
npm WARN deprecated inflight@1.0.6
npm WARN deprecated glob@7.2.3
npm WARN deprecated rimraf@2.7.1
```

**Explanation**: These are transitive dependencies (dependencies of dependencies). Already addressed earlier.
**Action**: ✅ Safe to ignore (already fixed with `npm audit fix`)

---

### 3. Optional Dependencies

**Warning Example:**
```
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.3.2
```

**Explanation**: fsevents is only needed on macOS. On Windows, it's skipped automatically.
**Action**: ✅ Safe to ignore on Windows

---

### 4. Funding Messages

**Warning Example:**
```
140 packages are looking for funding
  run `npm fund` for details
```

**Explanation**: Just informational - packages accepting donations.
**Action**: ✅ Safe to ignore

---

## ⚠️ Warnings That Need Action

### 1. Version Conflicts

**Warning Example:**
```
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^17.0.0" from @testing-library/react
```

**Solution**:
```powershell
# Force installation
npm install --legacy-peer-deps

# OR update to compatible versions
npm install @testing-library/react@latest
```

---

### 2. Missing TypeScript Types

**Warning Example:**
```
Could not find a declaration file for module 'jest'
```

**Solution**:
```powershell
npm install --save-dev @types/jest@latest
```

---

### 3. SWC Binary Not Found

**Warning Example:**
```
Error: Cannot find module '@swc/core-win32-x64-msvc'
```

**Solution**:
```powershell
# Reinstall with binary
npm install --save-dev @swc/core --force
```

---

## 🔍 Verify Installation

Run this command to verify everything is installed:

```powershell
# Check all test dependencies
npm list @testing-library/react @testing-library/jest-dom @testing-library/user-event jest @playwright/test @swc/jest
```

**Expected Output**: All packages should show version numbers without "UNMET PEER DEPENDENCY" errors.

---

## ✅ Quick Health Check

### Test 1: Jest Works
```powershell
npx jest --version
```
**Expected**: Should show version 30.x.x

### Test 2: Playwright Works
```powershell
npx playwright --version
```
**Expected**: Should show version 1.x.x

### Test 3: Run a Test
```powershell
npm test -- --listTests
```
**Expected**: Should list all test files found

---

## 🐛 Common Installation Issues

### Issue: "Cannot find module 'next/jest'"

**Cause**: Next.js version mismatch
**Solution**:
```powershell
# Ensure Next.js is installed
npm list next

# Should show: next@15.3.3 or similar
```

---

### Issue: "jest-environment-jsdom not found"

**Cause**: Missing environment package
**Solution**:
```powershell
npm install --save-dev jest-environment-jsdom
```

---

### Issue: "@swc/jest transform failed"

**Cause**: Platform-specific binary missing
**Solution**:
```powershell
# Remove and reinstall
npm uninstall @swc/core @swc/jest
npm install --save-dev @swc/core @swc/jest
```

---

### Issue: Playwright browsers not installed

**Warning**:
```
browserType.launch: Executable doesn't exist
```

**Solution**:
```powershell
npx playwright install
```

---

## 📊 Installation Summary

After running the installation script, you should have:

```
✅ jest@30.x.x
✅ @types/jest@30.x.x
✅ jest-environment-jsdom@30.x.x
✅ @testing-library/react@16.x.x
✅ @testing-library/jest-dom@6.x.x
✅ @testing-library/user-event@14.x.x
✅ @testing-library/dom@10.x.x
✅ @swc/core@1.x.x
✅ @swc/jest@0.2.x
✅ @playwright/test@1.x.x
```

---

## 🔧 Clean Installation (If Problems Persist)

If you encounter persistent issues:

```powershell
# 1. Remove node_modules and lock file
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall everything
npm install

# 4. Reinstall test dependencies
.\scripts\install-test-deps.ps1

# 5. Install Playwright browsers
npx playwright install
```

---

## 💡 What Warnings Can You Share?

Please copy and paste the specific warnings you received, and I can provide targeted solutions!

Common patterns to look for:
- "npm WARN deprecated ..."
- "npm WARN ERESOLVE ..."
- "npm ERR! ..."
- "Could not find ..."
- "peer dependency ..."

---

## ✨ Expected Installation Time

- **Dependencies**: 1-3 minutes
- **Playwright browsers**: 2-5 minutes (downloads Chrome, Firefox, Safari)
- **Total**: 3-8 minutes depending on internet speed

---

## 🎯 Next Steps After Installation

1. **Verify installation**: `npm test -- --version`
2. **Run first test**: `npm test`
3. **Try E2E test UI**: `npm run test:e2e:ui`
4. **Check coverage**: `npm run test:coverage`

---

**Need more help?** Share the exact warnings you received!
