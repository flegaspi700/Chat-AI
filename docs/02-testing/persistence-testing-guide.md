# localStorage Persistence Test Guide

## 🧪 Quick Test Procedure

### Test 1: Browser Refresh (Should Persist ✅)
1. Open http://localhost:9002
2. Upload a file or add a URL
3. Send a message to the AI
4. **Press F5 or Ctrl+R to refresh**
5. ✅ All your data should still be there!

### Test 2: Close Tab and Reopen (Should Persist ✅)
1. Have some messages and sources in the app
2. Close the browser tab completely
3. Open a new tab and go to http://localhost:9002
4. ✅ Everything should be restored with "Welcome back!" toast

### Test 3: Restart Dev Server (Should Persist ✅)
1. Have some data in the app
2. Go to terminal and press `Ctrl+C` to stop server
3. Run `npm run dev` again
4. Open http://localhost:9002 in browser
5. ✅ All data should still be there (localStorage is client-side!)

### Test 4: Clear Data (Should Delete ✅)
1. Have some messages and sources
2. Click Settings (gear icon) → "Clear All Data"
3. Confirm the deletion
4. ✅ Everything should be cleared
5. Refresh page → Should start fresh (no data)

### Test 5: Different Browser (Should NOT Share ❌)
1. Have data in Chrome
2. Open Firefox/Edge at http://localhost:9002
3. ❌ No data will be there (each browser has separate storage)

### Test 6: Incognito Mode (Should NOT Persist ❌)
1. Open http://localhost:9002 in incognito/private window
2. Add some data
3. Close the incognito window
4. Open new incognito window
5. ❌ Data is gone (incognito clears localStorage on close)

---

## 🔍 Inspect Your Data

### Chrome/Edge DevTools:
1. Press `F12`
2. Click **Application** tab
3. Left sidebar: **Storage** → **Local Storage** → `http://localhost:9002`
4. You'll see 3 keys:
   - `notechat-messages` - Your chat history
   - `notechat-sources` - Files and URLs
   - `notechat-ai-theme` - Custom theme

### Firefox DevTools:
1. Press `F12`
2. Click **Storage** tab
3. Expand **Local Storage** → `http://localhost:9002`

### View the JSON:
Click on any key to see the stored JSON data. Example:

```json
// notechat-messages
[
  {
    "id": "abc123",
    "role": "user",
    "content": "What is machine learning?"
  },
  {
    "id": "def456",
    "role": "ai",
    "content": "Machine learning is..."
  }
]
```

---

## 📊 Check Storage Usage

Open browser console (`F12` → Console) and run:

```javascript
// Check how much space you're using
const getStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return {
    bytes: total,
    kb: (total / 1024).toFixed(2),
    mb: (total / 1024 / 1024).toFixed(2),
    percentOfLimit: ((total / (5 * 1024 * 1024)) * 100).toFixed(2) + '%'
  };
};

console.table(getStorageSize());
```

You'll see something like:
```
bytes:        12458
kb:           12.17
mb:           0.01
percentOfLimit: 0.24%
```

---

## 🚨 When Storage Gets Full

If you hit the 5MB limit:

### Warning Signs:
- Console error: `QuotaExceededError`
- Toast notification (we handle this gracefully)
- Auto-save will fail silently

### Solutions:
1. **Clear old data**: Settings → "Clear All Data"
2. **Remove unused sources**: Delete old files/URLs from sidebar
3. **Export important chats**: (Feature to be added)
4. **Upgrade to IndexedDB**: (Future enhancement for larger storage)

---

## 💡 Pro Tips

### Manual Backup:
```javascript
// Copy this in console to backup your data
const backup = {
  messages: localStorage.getItem('notechat-messages'),
  sources: localStorage.getItem('notechat-sources'),
  theme: localStorage.getItem('notechat-ai-theme'),
  timestamp: new Date().toISOString()
};

// Copy the output
console.log(JSON.stringify(backup, null, 2));
```

### Manual Restore:
```javascript
// Paste your backup JSON here
const backup = { /* your backup data */ };

localStorage.setItem('notechat-messages', backup.messages);
localStorage.setItem('notechat-sources', backup.sources);
localStorage.setItem('notechat-ai-theme', backup.theme);

// Refresh the page
location.reload();
```

### Clear Specific Data:
```javascript
// Clear only messages (keep sources and theme)
localStorage.removeItem('notechat-messages');
location.reload();

// Clear only sources (keep messages and theme)
localStorage.removeItem('notechat-sources');
location.reload();
```

---

## 🔒 Privacy & Security

### Good News:
- ✅ localStorage is domain-specific (other sites can't access it)
- ✅ Data never leaves your browser (stays on your device)
- ✅ No cloud storage = no data breaches
- ✅ No network requests for persistence

### Important Notes:
- ⚠️ Data is NOT encrypted (stored as plain JSON)
- ⚠️ Anyone with access to your computer can read it
- ⚠️ Browser extensions can potentially access it
- ⚠️ Don't store sensitive information (passwords, SSNs, etc.)

---

## 📈 Future Enhancements

Currently on the roadmap:

1. **IndexedDB migration** - Support for larger files (>5MB)
2. **Export/Import** - Download/upload your data as JSON
3. **Cloud sync** - Optional Supabase/Firebase integration
4. **Encryption** - Optional client-side encryption for sensitive data
5. **Auto-cleanup** - Remove old messages after X days

---

## ❓ FAQ

**Q: Will my data sync across devices?**  
A: No, localStorage is device-specific. You'd need to manually export/import or use cloud sync (future feature).

**Q: What happens if I deploy to production?**  
A: localStorage will use the production domain. Data on localhost:9002 won't transfer to your-domain.com.

**Q: Can I increase the 5MB limit?**  
A: No, it's a browser limitation. But you can migrate to IndexedDB (~50MB) or WebSQL (deprecated).

**Q: Is my data backed up?**  
A: No, localStorage has no built-in backup. If you clear browser data, it's gone forever. Use the manual backup script above!

**Q: Can I use this in incognito mode?**  
A: Yes, but data will be cleared when you close the incognito window.

---

## ✅ Verification Checklist

Test these scenarios:

- [ ] Refresh page → Data persists
- [ ] Close tab, reopen → Data persists
- [ ] Stop server, restart → Data persists
- [ ] Close browser, reopen → Data persists
- [ ] Click "Clear All Data" → Data is removed
- [ ] Check DevTools → See 3 localStorage keys
- [ ] Different browser → No shared data
- [ ] Add 100+ messages → Check storage usage

---

**TL;DR:** Your data is stored in browser localStorage and will persist through server restarts, browser refreshes, and computer restarts. It only gets deleted if you clear browser cache, use the "Clear All Data" button, or switch to a different browser. ✅
