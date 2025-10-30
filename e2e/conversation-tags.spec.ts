import { test, expect } from '@playwright/test';

test.describe('Conversation Tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Clear any existing data
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Add a test file
    const fileContent = 'Test document about machine learning.';
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

  test('should display TagFilter button in conversation history', async ({ page }) => {
    // Open sidebar
    await page.click('button:has-text("Conversations")');
    
    // Should see Tags filter button
    await expect(page.locator('button:has-text("Tags")')).toBeVisible();
  });

  test('should show empty state when no tags exist', async ({ page }) => {
    // Open sidebar and tags filter
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    const tagsButton = page.locator('button').filter({ hasText: 'Tags' });
    await tagsButton.click();
    
    // Should show "No tags available"
    await expect(page.locator('text="No tags available"')).toBeVisible();
  });

  test('should add tag to conversation via storage', async ({ page }) => {
    // Create a conversation first
    const input = page.locator('textarea[placeholder="Ask a question about your documents..."]');
    await input.fill('Test question');
    await input.press('Enter');
    
    // Wait for AI response
    await page.waitForSelector('text=/.*Test.*/i', { timeout: 30000 });
    
    // Add tag via localStorage (simulating tag input functionality)
    await page.evaluate(() => {
      const conversations = JSON.parse(localStorage.getItem('notechat-conversations') || '[]');
      if (conversations.length > 0) {
        conversations[0].tags = ['work', 'important'];
        localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
      }
    });
    
    // Reload and check sidebar
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // Should see tags on conversation item
    await expect(page.locator('text="work"')).toBeVisible();
    await expect(page.locator('text="important"')).toBeVisible();
  });

  test('should filter conversations by single tag', async ({ page }) => {
    // Create multiple conversations with different tags
    await page.evaluate(() => {
      const conversations = [
        {
          id: 'conv-1',
          title: 'Work Discussion',
          messages: [{ id: '1', role: 'user' as const, content: 'Work question' }],
          sources: [],
          tags: ['work'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'conv-2',
          title: 'Personal Notes',
          messages: [{ id: '2', role: 'user' as const, content: 'Personal question' }],
          sources: [],
          tags: ['personal'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
    });
    
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // Both conversations should be visible
    await expect(page.locator('text="Work Discussion"')).toBeVisible();
    await expect(page.locator('text="Personal Notes"')).toBeVisible();
    
    // Open tags filter and select 'work'
    await page.locator('button').filter({ hasText: 'Tags' }).click();
    await page.locator('text="work"').click();
    
    // Only work conversation should be visible
    await expect(page.locator('text="Work Discussion"')).toBeVisible();
    await expect(page.locator('text="Personal Notes"')).not.toBeVisible();
  });

  test('should filter conversations by multiple tags (AND logic)', async ({ page }) => {
    // Create conversations with overlapping tags
    await page.evaluate(() => {
      const conversations = [
        {
          id: 'conv-1',
          title: 'Urgent Work Item',
          messages: [{ id: '1', role: 'user' as const, content: 'Question 1' }],
          sources: [],
          tags: ['work', 'urgent'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'conv-2',
          title: 'Work Discussion',
          messages: [{ id: '2', role: 'user' as const, content: 'Question 2' }],
          sources: [],
          tags: ['work'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'conv-3',
          title: 'Urgent Personal',
          messages: [{ id: '3', role: 'user' as const, content: 'Question 3' }],
          sources: [],
          tags: ['personal', 'urgent'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
    });
    
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // Select both 'work' and 'urgent' tags
    await page.locator('button').filter({ hasText: 'Tags' }).click();
    await page.locator('text="work"').click();
    await page.locator('text="urgent"').click();
    
    // Only conversation with both tags should be visible
    await expect(page.locator('text="Urgent Work Item"')).toBeVisible();
    await expect(page.locator('text="Work Discussion"')).not.toBeVisible();
    await expect(page.locator('text="Urgent Personal"')).not.toBeVisible();
  });

  test('should display tag count in filter dropdown', async ({ page }) => {
    // Create conversations with tags
    await page.evaluate(() => {
      const conversations = [
        {
          id: 'conv-1',
          title: 'Conv 1',
          messages: [{ id: '1', role: 'user' as const, content: 'Q1' }],
          sources: [],
          tags: ['work'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'conv-2',
          title: 'Conv 2',
          messages: [{ id: '2', role: 'user' as const, content: 'Q2' }],
          sources: [],
          tags: ['work', 'urgent'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'conv-3',
          title: 'Conv 3',
          messages: [{ id: '3', role: 'user' as const, content: 'Q3' }],
          sources: [],
          tags: ['personal'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
    });
    
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // Open tags filter
    await page.locator('button').filter({ hasText: 'Tags' }).click();
    
    // Should show counts
    await expect(page.locator('text=/work.*\\(2\\)/')).toBeVisible();
    await expect(page.locator('text=/urgent.*\\(1\\)/')).toBeVisible();
    await expect(page.locator('text=/personal.*\\(1\\)/')).toBeVisible();
  });

  test('should show active tag filters as badges', async ({ page }) => {
    // Create conversation with tags
    await page.evaluate(() => {
      const conversations = [
        {
          id: 'conv-1',
          title: 'Test Conversation',
          messages: [{ id: '1', role: 'user' as const, content: 'Test' }],
          sources: [],
          tags: ['work', 'important'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
    });
    
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // Select a tag filter
    await page.locator('button').filter({ hasText: 'Tags' }).click();
    await page.locator('text="work"').first().click();
    
    // Should show badge with selected tag
    const badge = page.locator('[class*="badge"]').filter({ hasText: 'work' });
    await expect(badge).toBeVisible();
  });

  test('should remove tag filter by clicking X on badge', async ({ page }) => {
    // Setup conversation with tags
    await page.evaluate(() => {
      const conversations = [
        {
          id: 'conv-1',
          title: 'Work Item',
          messages: [{ id: '1', role: 'user' as const, content: 'Test' }],
          sources: [],
          tags: ['work'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'conv-2',
          title: 'Personal Item',
          messages: [{ id: '2', role: 'user' as const, content: 'Test 2' }],
          sources: [],
          tags: ['personal'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
    });
    
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // Apply tag filter
    await page.locator('button').filter({ hasText: 'Tags' }).click();
    await page.locator('text="work"').first().click();
    
    // Should filter to only work items
    await expect(page.locator('text="Work Item"')).toBeVisible();
    await expect(page.locator('text="Personal Item"')).not.toBeVisible();
    
    // Click X on the badge to remove filter
    const badge = page.locator('[class*="badge"]').filter({ hasText: 'work' });
    await badge.locator('button').click();
    
    // Both conversations should be visible again
    await expect(page.locator('text="Work Item"')).toBeVisible();
    await expect(page.locator('text="Personal Item"')).toBeVisible();
  });

  test('should clear all tag filters', async ({ page }) => {
    // Setup
    await page.evaluate(() => {
      const conversations = [
        {
          id: 'conv-1',
          title: 'Item 1',
          messages: [{ id: '1', role: 'user' as const, content: 'Test' }],
          sources: [],
          tags: ['work', 'urgent'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
    });
    
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // Select multiple tags
    await page.locator('button').filter({ hasText: 'Tags' }).click();
    await page.locator('text="work"').first().click();
    
    // Open dropdown again and click Clear
    await page.locator('button').filter({ hasText: 'Tags' }).click();
    await page.locator('button:has-text("Clear")').click();
    
    // Badges should be gone
    const workBadge = page.locator('[class*="badge"]').filter({ hasText: 'work' });
    await expect(workBadge).not.toBeVisible();
  });

  test('should show tag badges with consistent colors', async ({ page }) => {
    // Create conversation with multiple tags
    await page.evaluate(() => {
      const conversations = [
        {
          id: 'conv-1',
          title: 'Multi-tag Conversation',
          messages: [{ id: '1', role: 'user' as const, content: 'Test' }],
          sources: [],
          tags: ['work', 'urgent', 'project-a'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
    });
    
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // All tags should be visible on conversation item
    await expect(page.locator('text="work"')).toBeVisible();
    await expect(page.locator('text="urgent"')).toBeVisible();
    await expect(page.locator('text="project-a"')).toBeVisible();
    
    // Each should have a color class (bg-*-500/10)
    const workTag = page.locator('[class*="bg-"]').filter({ hasText: 'work' }).first();
    await expect(workTag).toHaveClass(/bg-(blue|green|amber|red|violet|pink|teal|orange|indigo|lime|cyan|purple)-500/);
  });

  test('should remove tag from conversation', async ({ page }) => {
    // Create conversation with tags
    await page.evaluate(() => {
      const conversations = [
        {
          id: 'conv-1',
          title: 'Tagged Conversation',
          messages: [{ id: '1', role: 'user' as const, content: 'Test' }],
          sources: [],
          tags: ['work', 'urgent'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
    });
    
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // Hover over conversation to reveal tag actions
    const conversation = page.locator('text="Tagged Conversation"').locator('..');
    await conversation.hover();
    
    // Click remove button on 'work' tag
    const workTag = page.locator('[class*="bg-"]').filter({ hasText: 'work' }).first();
    const removeButton = workTag.locator('button').first();
    await removeButton.click();
    
    // Tag should be removed
    await expect(page.locator('text="work"')).not.toBeVisible();
    await expect(page.locator('text="urgent"')).toBeVisible();
  });

  test('should update filter count when tags are selected', async ({ page }) => {
    // Setup
    await page.evaluate(() => {
      const conversations = [
        {
          id: 'conv-1',
          title: 'Test',
          messages: [{ id: '1', role: 'user' as const, content: 'Test' }],
          sources: [],
          tags: ['work'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('notechat-conversations', JSON.stringify(conversations));
    });
    
    await page.reload();
    await page.click('button[aria-label="Toggle sidebar"]');
    await page.waitForTimeout(500);
    
    // Initially no badge on Filters button
    const filtersButton = page.locator('button:has-text("Filters")');
    await expect(filtersButton.locator('[class*="badge"]')).not.toBeVisible();
    
    // Select a tag
    await page.locator('button').filter({ hasText: 'Tags' }).click();
    await page.locator('text="work"').first().click();
    
    // Should show count badge on Filters button
    await expect(filtersButton.locator('[class*="badge"]')).toBeVisible();
    await expect(filtersButton.locator('text="1"')).toBeVisible();
  });
});
