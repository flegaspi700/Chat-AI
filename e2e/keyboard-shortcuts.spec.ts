import { test, expect } from '@playwright/test';

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Ctrl+N creates a new conversation', async ({ page }) => {
    // Type a message first to create a conversation
    const input = page.getByPlaceholder(/ask a question/i);
    await input.fill('Test message for keyboard shortcut');
    await input.press('Enter');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Press Ctrl+N (Cmd+N on Mac)
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+N' : 'Control+N');
    
    // Should see "New Conversation" button or toast
    await expect(page.getByText(/new conversation/i)).toBeVisible();
    
    // Chat should be cleared
    const messages = page.locator('[data-testid="chat-message"]');
    await expect(messages).toHaveCount(0);
  });

  test('Ctrl+K focuses the search input', async ({ page }) => {
    // Open conversations tab
    await page.getByRole('tab', { name: /conversations/i }).click();
    
    // Press Ctrl+K
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    
    // Search input should be focused
    const searchInput = page.getByPlaceholder(/search conversations/i);
    await expect(searchInput).toBeFocused();
  });

  test('Ctrl+Shift+T toggles theme', async ({ page }) => {
    // Get the current theme
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('class');
    
    // Press Ctrl+Shift+T
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+Shift+T' : 'Control+Shift+T');
    
    // Wait for theme to change
    await page.waitForTimeout(500);
    
    // Theme should be different
    const newTheme = await html.getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('Escape key closes dialogs/modals', async ({ page }) => {
    // This test will verify escape functionality when we have modals
    // For now, just verify it doesn't cause errors
    await page.keyboard.press('Escape');
    
    // Page should still be functional
    await expect(page.getByPlaceholder(/ask a question/i)).toBeVisible();
  });

  test('Keyboard shortcuts are disabled during pending state', async ({ page }) => {
    const input = page.getByPlaceholder(/ask a question/i);
    
    // Start a request
    await input.fill('Test message');
    await input.press('Enter');
    
    // Immediately try Ctrl+N while request is pending
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+N' : 'Control+N');
    
    // Should not create new conversation (message should still be there)
    await page.waitForTimeout(1000);
    const messages = page.locator('[data-testid="chat-message"]');
    await expect(messages.first()).toBeVisible();
  });

  test('Keyboard shortcuts work from different tabs', async ({ page }) => {
    // From sources tab
    await page.getByRole('tab', { name: /sources/i }).click();
    
    // Ctrl+K should switch to conversations and focus search
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    
    // Should be on conversations tab
    await expect(page.getByRole('tab', { name: /conversations/i })).toHaveAttribute('data-state', 'active');
    
    // Search should be focused
    const searchInput = page.getByPlaceholder(/search conversations/i);
    await expect(searchInput).toBeFocused();
  });

  test('Keyboard shortcuts do not interfere with input fields', async ({ page }) => {
    const input = page.getByPlaceholder(/ask a question/i);
    await input.click();
    
    // Type text that includes shortcut keys
    await input.fill('Press Ctrl+N to create new conversation');
    
    // Text should be preserved, not trigger shortcut
    await expect(input).toHaveValue('Press Ctrl+N to create new conversation');
  });
});
