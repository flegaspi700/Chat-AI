import { test, expect } from '@playwright/test';

test.describe('Export Conversations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should show export button when hovering over conversation', async ({ page, isMobile }) => {
    if (isMobile) test.skip(); // Export UI may not be visible on mobile hover

    // First create a conversation by sending a message
    const chatInput = page.locator('textarea[placeholder*="Ask"]');
    await chatInput.fill('Test conversation for export');
    
    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    // Wait for conversation to be created
    await page.waitForTimeout(2000);

    // Switch to Conversations tab
    const conversationsTab = page.locator('[role="tab"]', { hasText: 'Conversations' });
    await conversationsTab.click();

    // Find the first conversation
    const conversation = page.locator('[role="button"]').first();
    await expect(conversation).toBeVisible();

    // Hover over conversation to reveal export button
    await conversation.hover();

    // Check if export button (Download icon) appears
    const exportButton = page.locator('button[aria-label="Export conversation"]');
    await expect(exportButton).toBeVisible();
  });

  test('should show export dropdown menu with TXT and PDF options', async ({ page, isMobile }) => {
    if (isMobile) test.skip(); // Skip on mobile for consistent UI

    // Create a test conversation
    const chatInput = page.locator('textarea[placeholder*="Ask"]');
    await chatInput.fill('Export test message');
    
    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    // Wait for conversation
    await page.waitForTimeout(2000);

    // Switch to Conversations tab
    const conversationsTab = page.locator('[role="tab"]', { hasText: 'Conversations' });
    await conversationsTab.click();

    // Find and hover over conversation
    const conversation = page.locator('[role="button"]').first();
    await conversation.hover();

    // Click export button
    const exportButton = page.locator('button[aria-label="Export conversation"]');
    await exportButton.click();

    // Check dropdown menu appears
    const txtOption = page.locator('text=Export as TXT');
    const pdfOption = page.locator('text=Export as PDF');

    await expect(txtOption).toBeVisible();
    await expect(pdfOption).toBeVisible();
  });

  test('should display export success toast when exporting as TXT', async ({ page, isMobile }) => {
    if (isMobile) test.skip(); // Skip on mobile

    // Create a conversation
    const chatInput = page.locator('textarea[placeholder*="Ask"]');
    await chatInput.fill('TXT export test');
    
    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    await page.waitForTimeout(2000);

    // Switch to Conversations tab
    const conversationsTab = page.locator('[role="tab"]', { hasText: 'Conversations' });
    await conversationsTab.click();

    // Hover and click export
    const conversation = page.locator('[role="button"]').first();
    await conversation.hover();

    const exportButton = page.locator('button[aria-label="Export conversation"]');
    await exportButton.click();

    // Click Export as TXT
    const txtOption = page.locator('text=Export as TXT');
    await txtOption.click();

    // Check for success toast
    const toast = page.locator('text=/Exported as TXT/i');
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('should display export success toast when exporting as PDF', async ({ page, isMobile }) => {
    if (isMobile) test.skip(); // Skip on mobile

    // Create a conversation
    const chatInput = page.locator('textarea[placeholder*="Ask"]');
    await chatInput.fill('PDF export test');
    
    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    await page.waitForTimeout(2000);

    // Switch to Conversations tab
    const conversationsTab = page.locator('[role="tab"]', { hasText: 'Conversations' });
    await conversationsTab.click();

    // Hover and click export
    const conversation = page.locator('[role="button"]').first();
    await conversation.hover();

    const exportButton = page.locator('button[aria-label="Export conversation"]');
    await exportButton.click();

    // Click Export as PDF
    const pdfOption = page.locator('text=Export as PDF');
    await pdfOption.click();

    // Check for success toast
    const toast = page.locator('text=/Exported as PDF/i');
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('export button should not interfere with conversation loading', async ({ page, isMobile }) => {
    if (isMobile) test.skip(); // Skip on mobile

    // Create a conversation
    const chatInput = page.locator('textarea[placeholder*="Ask"]');
    await chatInput.fill('Click test conversation');
    
    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    await page.waitForTimeout(2000);

    // Switch to Conversations tab
    const conversationsTab = page.locator('[role="tab"]', { hasText: 'Conversations' });
    await conversationsTab.click();

    // Click the conversation itself (not the export button)
    const conversation = page.locator('[role="button"]').first();
    await conversation.hover();
    
    // Click the conversation title area
    await conversation.click();

    // Verify conversation loaded (chat input should still be visible)
    await expect(chatInput).toBeVisible();
  });
});
