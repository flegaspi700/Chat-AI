import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('URL Scraping Flow', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open sidebar on mobile if needed
    if (isMobile) {
      const sidebarTrigger = page.locator('[data-sidebar="trigger"]');
      await sidebarTrigger.waitFor({ state: 'visible' });
      await sidebarTrigger.click();
      await page.waitForTimeout(300);
    }
    
    // Switch to Sources tab
    const sourcesTab = page.locator('[role="tab"]', { hasText: 'Sources' });
    await sourcesTab.click();
  });

  test('should have URL input field', async ({ page }) => {
    // URL input should be visible
    const urlInput = page.locator('input[placeholder*="Enter"]');
    await expect(urlInput).toBeVisible();
    
    const addUrlButton = page.getByRole('button', { name: /Add URL/i });
    await expect(addUrlButton).toBeVisible();
  });

  test('should show error for invalid URL', async ({ page }) => {
    // Enter invalid URL
    const urlInput = page.locator('input[placeholder*="Enter"]');
    await urlInput.fill('not-a-valid-url');
    
    const addUrlButton = page.getByRole('button', { name: /Add URL/i });
    await addUrlButton.click();

    // Should show error toast or message
    await expect(page.locator('text=/Invalid URL|error/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should allow combining files and URLs', async ({ page }) => {
    // Upload a file
    const addFilesButton = page.getByRole('button', { name: /Add Files/i });
    await addFilesButton.click();
    
    const testFile = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    await page.locator('input[type="file"]').setInputFiles(testFile);
    await expect(page.locator('text=sample-article.txt').first()).toBeVisible();

    // Both file and URL sections should be visible
    await expect(page.getByRole('heading', { name: 'Files' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'URLs' })).toBeVisible();
  });
});
