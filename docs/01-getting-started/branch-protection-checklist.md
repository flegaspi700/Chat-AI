# ✅ Branch Protection Setup Checklist

**Goal:** Protect `main` branch from broken code  
**Time:** 5-10 minutes

---

## 🚀 Quick Steps

### **1. Open GitHub Settings** ✋
```
👉 https://github.com/flegaspi700/DocuNote/settings/branches
```

Or manually:
- Go to https://github.com/flegaspi700/DocuNote
- Click "Settings" tab
- Click "Branches" in left sidebar

---

### **2. Click "Add branch protection rule"** ✋

---

### **3. Enter Branch Name** ✋
```
Branch name pattern: main
```

---

### **4. Enable These Settings** ✋

Copy this checklist to GitHub:

#### Section 1: Pull Request Requirements
- [ ] ✅ **Require a pull request before merging**
  - [ ] Require approvals: 0 (or 1 if you want)
  - [ ] Dismiss stale pull request approvals when new commits are pushed

#### Section 2: Status Checks (IMPORTANT!)
- [ ] ✅ **Require status checks to pass before merging**
  - [ ] ✅ Require branches to be up to date before merging
  - [ ] Search for status checks: Type "CI" and select:
    - [ ] ✅ **CI / Code Quality & Tests**

#### Section 3: Additional Settings
- [ ] ✅ **Require conversation resolution before merging**
- [ ] ✅ **Do not allow bypassing the above settings**

#### Section 4: Optional (Recommended)
- [ ] ✅ **Require linear history**
- [ ] ✅ **Require signed commits** (if you use GPG)

---

### **5. Click "Create"** ✋

Scroll to bottom, click the green **"Create"** button.

---

## 🧪 Test It Works

### **After saving, test in PowerShell:**

```powershell
# Make a test change
echo "# Testing branch protection" >> README.md

# Try to push to main (should fail!)
git add README.md
git commit -m "test: branch protection"
git push origin main
```

### **Expected Error:**
```
❌ remote: error: GH006: Protected branch update failed
❌ remote: error: Changes must be made through a pull request
```

**If you see this error → SUCCESS!** ✅

---

## 🎯 If It Worked

Undo the test:
```powershell
git reset HEAD~1
git restore README.md
```

---

## 📋 What You Set Up

```
Branch: main

Protection:
✅ No direct pushes
✅ Must use pull requests
✅ CI must pass to merge
✅ Branch must be updated
✅ All comments resolved
✅ No bypassing rules
```

---

## 🔗 Quick Links

**Settings Page:**  
https://github.com/flegaspi700/DocuNote/settings/branches

**Full Guide:**  
`docs/01-getting-started/branch-protection-setup.md`

---

## 🆘 Troubleshooting

### **Can't find "CI / Code Quality & Tests"?**
- Your CI workflow needs to run at least once first
- Check: https://github.com/flegaspi700/DocuNote/actions
- If CI has run, the status check will appear

### **Checkbox not appearing?**
- Type exactly: `CI` in the search box
- Wait a second for it to load
- Select "CI / Code Quality & Tests" when it appears

### **Want to disable later?**
- Go back to Settings → Branches
- Click "Edit" or "Delete" on the rule

---

## ✅ Done?

Tell me when you've completed the setup and we'll test it together! 🚀
