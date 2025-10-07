import { test, expect } from '@playwright/test';

test.describe('URL Scraping Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should scrape URL and ask questions', async ({ page }) => {
    // Open sidebar
    await page.click('[aria-label="Toggle sidebar"]');

    // Enter URL
    const urlInput = page.locator('input[placeholder*="URL"]');
    await urlInput.fill('http://quotes.toscrape.com/');
    
    // Click add URL button
    await page.click('button:has-text("Add")');

    // Wait for URL to be scraped and added
    await expect(page.locator('text=/Quotes to Scrape|quotes.toscrape/i')).toBeVisible({ timeout: 10000 });

    // Ask question about scraped content
    const chatInput = page.locator('input[placeholder*="Ask"]');
    await chatInput.fill('What quotes are on this page?');
    await chatInput.press('Enter');

    // Wait for response mentioning quotes or authors
    await expect(page.locator('text=/Einstein|Rowling|quote/i')).toBeVisible({ timeout: 15000 });
  });

  test('should handle invalid URL gracefully', async ({ page }) => {
    await page.click('[aria-label="Toggle sidebar"]');

    // Enter invalid URL
    const urlInput = page.locator('input[placeholder*="URL"]');
    await urlInput.fill('not-a-valid-url');
    await page.click('button:has-text("Add")');

    // Should show error toast
    await expect(page.locator('text=/error|failed|invalid/i')).toBeVisible({ timeout: 5000 });
  });

  test('should combine file and URL sources', async ({ page }) => {
    await page.click('[aria-label="Toggle sidebar"]');

    // Upload file
    const testFile = path.join(process.cwd(), 'test-files', 'sample-article.txt');
    await page.locator('input[type="file"]').setInputFiles(testFile);
    await expect(page.locator('text=sample-article.txt')).toBeVisible();

    // Add URL
    const urlInput = page.locator('input[placeholder*="URL"]');
    await urlInput.fill('http://quotes.toscrape.com/');
    await page.click('button:has-text("Add")');
    await expect(page.locator('text=/quotes.toscrape/i')).toBeVisible();

    // Ask question requiring both sources
    const chatInput = page.locator('input[placeholder*="Ask"]');
    await chatInput.fill('Combine information from my sources');
    await chatInput.press('Enter');

    // Should get response using both sources
    await expect(page.locator('[role="article"]').last()).toBeVisible({ timeout: 15000 });
  });
});

import path from 'path';
