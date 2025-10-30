import { test, expect } from '@playwright/test';

test.describe('Message Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Clear any existing data
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Add a test file
    const fileContent = 'Test document about machine learning and AI.';
    await page.evaluate((content) => {
      const fileInfo = {
        id: 'test-file',
        name: 'test.txt',
        type: 'text/plain',
        size: content.length,
        content: content,
        uploadedAt: Date.now(),
      };
      localStorage.setItem('notechat-sources', JSON.stringify([fileInfo]));
    }, fileContent);
    
    await page.reload();
  });

  test('should show edit button on hover for user messages', async ({ page }) => {
    // Send a message
    const input = page.locator('textarea[placeholder="Ask a question about your documents..."]');
    await input.fill('What is machine learning?');
    await input.press('Enter');
    
    // Wait for AI response
    await page.waitForSelector('text=/.*learning.*/i', { timeout: 30000 });
    
    // Find user message
    const userMessage = page.locator('.group').filter({ hasText: 'What is machine learning?' }).first();
    
    // Edit button should be hidden initially
    const editButton = userMessage.locator('button[aria-label="Edit message"]');
    await expect(editButton).toHaveClass(/opacity-0/);
    
    // Hover over message
    await userMessage.hover();
    
    // Edit button should become visible
    await expect(editButton).toHaveClass(/opacity-100/);
  });

  test('should enter edit mode when edit button is clicked', async ({ page }) => {
    // Send a message
    const input = page.locator('textarea[placeholder="Ask a question about your documents..."]');
    await input.fill('What is AI?');
    await input.press('Enter');
    
    // Wait for AI response
    await page.waitForSelector('text=/.*AI.*/i', { timeout: 30000 });
    
    // Click edit button
    const userMessage = page.locator('.group').filter({ hasText: 'What is AI?' }).first();
    await userMessage.hover();
    const editButton = userMessage.locator('button[aria-label="Edit message"]');
    await editButton.click();
    
    // Should show textarea with current content
    const textarea = page.locator('textarea').filter({ hasText: 'What is AI?' });
    await expect(textarea).toBeVisible();
    
    // Should show Save and Cancel buttons
    await expect(page.locator('button:has-text("Save & Regenerate")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
  });

  test('should cancel edit without making changes', async ({ page }) => {
    // Send a message
    const input = page.locator('textarea[placeholder="Ask a question about your documents..."]');
    const originalMessage = 'Tell me about neural networks';
    await input.fill(originalMessage);
    await input.press('Enter');
    
    // Wait for response
    await page.waitForSelector('text=/.*neural.*/i', { timeout: 30000 });
    
    // Enter edit mode
    const userMessage = page.locator('.group').filter({ hasText: originalMessage }).first();
    await userMessage.hover();
    await userMessage.locator('button[aria-label="Edit message"]').click();
    
    // Modify text
    const textarea = page.locator('textarea').filter({ hasText: originalMessage });
    await textarea.fill('Different question');
    
    // Click Cancel
    await page.locator('button:has-text("Cancel")').click();
    
    // Should restore original message
    await expect(page.locator(`text="${originalMessage}"`)).toBeVisible();
    
    // Textarea should be gone
    await expect(textarea).not.toBeVisible();
  });

  test('should save edit and regenerate response', async ({ page }) => {
    // Send initial message
    const input = page.locator('textarea[placeholder="Ask a question about your documents..."]');
    await input.fill('What is AI?');
    await input.press('Enter');
    
    // Wait for AI response
    await page.waitForSelector('text=/.*AI.*/i', { timeout: 30000 });
    
    // Count initial messages
    const initialMessageCount = await page.locator('.group').count();
    
    // Enter edit mode
    const userMessage = page.locator('.group').filter({ hasText: 'What is AI?' }).first();
    await userMessage.hover();
    await userMessage.locator('button[aria-label="Edit message"]').click();
    
    // Edit message
    const textarea = page.locator('textarea').filter({ hasText: 'What is AI?' });
    const newMessage = 'What is machine learning?';
    await textarea.fill(newMessage);
    
    // Save
    await page.locator('button:has-text("Save & Regenerate")').click();
    
    // Should show new message
    await expect(page.locator(`text="${newMessage}"`)).toBeVisible();
    
    // Should generate new AI response
    await page.waitForSelector('text=/.*learning.*/i', { timeout: 30000 });
    
    // Message count should be updated (edited user message + new AI response)
    const finalMessageCount = await page.locator('.group').count();
    expect(finalMessageCount).toBe(2); // User message + AI response
  });

  test('should show edited timestamp on modified messages', async ({ page }) => {
    // Send message
    const input = page.locator('textarea[placeholder="Ask a question about your documents..."]');
    await input.fill('Original question');
    await input.press('Enter');
    
    // Wait for response
    await page.waitForSelector('text=/.*question.*/i', { timeout: 30000 });
    
    // Edit message
    const userMessage = page.locator('.group').filter({ hasText: 'Original question' }).first();
    await userMessage.hover();
    await userMessage.locator('button[aria-label="Edit message"]').click();
    await page.locator('textarea').filter({ hasText: 'Original question' }).fill('Edited question');
    await page.locator('button:has-text("Save & Regenerate")').click();
    
    // Wait for new response
    await page.waitForTimeout(2000);
    
    // Should show "Edited" indicator
    await expect(page.locator('text=/Edited/')).toBeVisible();
  });

  test('should show confirmation dialog when deleting multiple messages', async ({ page }) => {
    // Send multiple messages to build conversation
    const input = page.locator('textarea[placeholder="Ask a question about your documents..."]');
    
    await input.fill('First question');
    await input.press('Enter');
    await page.waitForSelector('text=/.*question.*/i', { timeout: 30000 });
    
    await input.fill('Second question');
    await input.press('Enter');
    await page.waitForSelector('text=/.*Second.*/i', { timeout: 30000 });
    
    await input.fill('Third question');
    await input.press('Enter');
    await page.waitForSelector('text=/.*Third.*/i', { timeout: 30000 });
    
    // Edit first message (should delete 4+ subsequent messages)
    const firstMessage = page.locator('.group').filter({ hasText: 'First question' }).first();
    await firstMessage.hover();
    await firstMessage.locator('button[aria-label="Edit message"]').click();
    await page.locator('textarea').filter({ hasText: 'First question' }).fill('New first question');
    await page.locator('button:has-text("Save & Regenerate")').click();
    
    // Should show confirmation dialog
    await expect(page.locator('text=/Regenerate responses?/i')).toBeVisible();
    await expect(page.locator('text=/delete all subsequent messages/i')).toBeVisible();
  });

  test('should proceed with edit after confirmation', async ({ page }) => {
    // Build conversation with multiple messages
    const input = page.locator('textarea[placeholder="Ask a question about your documents..."]');
    
    await input.fill('Question 1');
    await input.press('Enter');
    await page.waitForSelector('text=/.*Question.*/i', { timeout: 30000 });
    
    await input.fill('Question 2');
    await input.press('Enter');
    await page.waitForTimeout(2000);
    
    await input.fill('Question 3');
    await input.press('Enter');
    await page.waitForTimeout(2000);
    
    // Edit first message
    const firstMessage = page.locator('.group').filter({ hasText: 'Question 1' }).first();
    await firstMessage.hover();
    await firstMessage.locator('button[aria-label="Edit message"]').click();
    await page.locator('textarea').filter({ hasText: 'Question 1' }).fill('Edited Question 1');
    await page.locator('button:has-text("Save & Regenerate")').click();
    
    // Confirm in dialog
    await page.locator('button:has-text("Continue")').click();
    
    // Should show edited message and regenerate
    await expect(page.locator('text="Edited Question 1"')).toBeVisible();
  });

  test('should disable edit button during streaming', async ({ page }) => {
    // Send a message
    const input = page.locator('textarea[placeholder="Ask a question about your documents..."]');
    await input.fill('What is AI?');
    await input.press('Enter');
    
    // While streaming, try to edit
    const userMessage = page.locator('.group').filter({ hasText: 'What is AI?' }).first();
    await userMessage.hover();
    const editButton = userMessage.locator('button[aria-label="Edit message"]');
    
    // Edit button should be disabled during streaming
    await expect(editButton).toBeDisabled();
    
    // Wait for stream to complete
    await page.waitForSelector('text=/.*AI.*/i', { timeout: 30000 });
    
    // Now should be enabled
    await expect(editButton).toBeEnabled();
  });
});
