import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should upload text file and ask questions', async ({ page }) => {
    // Open sidebar
    await page.click('[aria-label="Toggle sidebar"]', { timeout: 5000 });

    // Upload file
    const testFile = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    // Wait for file to appear in sidebar
    await expect(page.locator('text=sample-article.txt')).toBeVisible({ timeout: 10000 });

    // Type question
    const input = page.locator('input[placeholder*="Ask"]');
    await input.fill('When was the term artificial intelligence coined?');
    await input.press('Enter');

    // Wait for AI response
    await expect(page.locator('text=/1956|John McCarthy/i')).toBeVisible({ timeout: 15000 });
  });

  test('should handle multiple file uploads', async ({ page }) => {
    await page.click('[aria-label="Toggle sidebar"]');

    // Upload first file
    const file1 = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    await page.locator('input[type="file"]').setInputFiles(file1);
    await expect(page.locator('text=sample-article.txt')).toBeVisible();

    // Upload second file
    const file2 = path.join(process.cwd(), 'test-files', 'company-policies.txt');
    await page.locator('input[type="file"]').setInputFiles(file2);
    await expect(page.locator('text=company-policies.txt')).toBeVisible();

    // Verify both files are in sidebar
    expect(await page.locator('[data-source-item]').count()).toBe(2);
  });

  test('should remove uploaded file', async ({ page }) => {
    await page.click('[aria-label="Toggle sidebar"]');

    // Upload file
    const testFile = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    await page.locator('input[type="file"]').setInputFiles(testFile);
    await expect(page.locator('text=sample-article.txt')).toBeVisible();

    // Click remove button
    await page.locator('[aria-label="Remove source"]').first().click();

    // Verify file is removed
    await expect(page.locator('text=sample-article.txt')).not.toBeVisible();
  });
});
