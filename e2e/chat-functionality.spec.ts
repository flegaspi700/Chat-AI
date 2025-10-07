import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show empty state without sources', async ({ page }) => {
    await expect(page.locator('text=/upload files or add urls/i')).toBeVisible();
  });

  test('should not allow empty message submission', async ({ page }) => {
    const input = page.locator('input[placeholder*="Ask"]');
    await input.fill('   '); // Only spaces
    await input.press('Enter');

    // Input should still be empty or cleared
    await expect(input).toHaveValue('');
  });

  test('should display user and AI messages', async ({ page }) => {
    // Add a source first
    await page.click('[aria-label="Toggle sidebar"]');
    const testFile = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    await page.locator('input[type="file"]').setInputFiles(testFile);
    await expect(page.locator('text=sample-article.txt')).toBeVisible();

    // Send message
    const input = page.locator('input[placeholder*="Ask"]');
    await input.fill('What is AI?');
    await input.press('Enter');

    // User message should appear
    await expect(page.locator('text=What is AI?')).toBeVisible();

    // AI response should appear
    await expect(page.locator('[role="article"]').nth(1)).toBeVisible({ timeout: 15000 });
  });

  test('should show loading state during AI response', async ({ page }) => {
    await page.click('[aria-label="Toggle sidebar"]');
    const testFile = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    await page.locator('input[type="file"]').setInputFiles(testFile);
    await expect(page.locator('text=sample-article.txt')).toBeVisible();

    const input = page.locator('input[placeholder*="Ask"]');
    await input.fill('Test question');
    await input.press('Enter');

    // Should show loading indicator
    await expect(page.locator('[data-testid="skeleton"]').or(page.locator('text=/thinking|loading/i'))).toBeVisible({ timeout: 2000 });
  });

  test('should maintain conversation history', async ({ page }) => {
    await page.click('[aria-label="Toggle sidebar"]');
    const testFile = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    await page.locator('input[type="file"]').setInputFiles(testFile);
    await expect(page.locator('text=sample-article.txt')).toBeVisible();

    // Send first message
    const input = page.locator('input[placeholder*="Ask"]');
    await input.fill('First question');
    await input.press('Enter');
    await page.waitForTimeout(3000);

    // Send second message
    await input.fill('Second question');
    await input.press('Enter');
    await page.waitForTimeout(3000);

    // Both questions should be visible
    await expect(page.locator('text=First question')).toBeVisible();
    await expect(page.locator('text=Second question')).toBeVisible();
  });
});

import path from 'path';
