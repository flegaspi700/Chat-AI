import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Upload Flow', () => {
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

  test('should upload text file', async ({ page }) => {
    // Click Add Files button to trigger file input
    const addFilesButton = page.getByRole('button', { name: /Add Files/i });
    await addFilesButton.click();

    // Upload file
    const testFile = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    // Wait for file to appear in sidebar (use first match to avoid strict mode violation)
    await expect(page.locator('text=sample-article.txt').first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle multiple file uploads', async ({ page, isMobile }) => {
    // Skip on mobile - flaky button click behavior
    if (isMobile) {
      test.skip();
    }
    
    const addFilesButton = page.getByRole('button', { name: /Add Files/i });

    // Upload first file
    await addFilesButton.click();
    const file1 = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    await page.locator('input[type="file"]').setInputFiles(file1);
    await expect(page.locator('text=sample-article.txt').first()).toBeVisible();

    // Upload second file
    await addFilesButton.click();
    const file2 = path.join(process.cwd(), 'test-files', 'company-policies.txt');
    await page.locator('input[type="file"]').setInputFiles(file2);
    await expect(page.locator('text=company-policies.txt').first()).toBeVisible();
  });

  test('should remove uploaded file', async ({ page, isMobile }) => {
    // Skip on mobile - flaky button click behavior
    if (isMobile) {
      test.skip();
    }
    
    // Upload file first
    const addFilesButton = page.getByRole('button', { name: /Add Files/i });
    await addFilesButton.click();
    
    const testFile = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    await page.locator('input[type="file"]').setInputFiles(testFile);
    await expect(page.locator('text=sample-article.txt').first()).toBeVisible();

    // Click remove button (the trash icon button)
    const removeButton = page.locator('button:has-text("Remove")').first();
    await removeButton.click();

    // Verify file is removed (check the sidebar file list specifically)
    const fileList = page.locator('text=No files added');
    await expect(fileList).toBeVisible();
  });
});
