import { test, expect } from '@playwright/test';

test.describe('Conversation Search', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    // Skip mobile tests as search is only visible in sidebar (desktop feature)
    if (isMobile) {
      test.skip();
    }
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-sidebar="trigger"]', { state: 'visible' });
  });

  test('should display search input in sidebar', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search conversations"]');
    await expect(searchInput).toBeVisible();
  });

  test('should have correct placeholder text', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search conversations"]');
    await expect(searchInput).toHaveAttribute('placeholder', 'Search conversations...');
  });

  test('should allow typing in search input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search conversations"]');
    await searchInput.fill('test query');
    await expect(searchInput).toHaveValue('test query');
  });

  test('should show clear button when text is entered', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search conversations"]');
    const clearButton = page.locator('button[aria-label="Clear search"]');
    await searchInput.fill('test');
    await expect(clearButton).toBeVisible();
  });

  test('should clear search when clear button is clicked', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search conversations"]');
    const clearButton = page.locator('button[aria-label="Clear search"]');
    await searchInput.fill('test query');
    await expect(searchInput).toHaveValue('test query');
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
    await expect(clearButton).not.toBeVisible();
  });

  test('should show empty state when no conversations exist', async ({ page }) => {
    const emptyMessage = page.locator('text=/No conversations yet/i');
    await expect(emptyMessage).toBeVisible();
  });

  test('should be in the Conversations tab by default', async ({ page }) => {
    const conversationsTab = page.locator('button[role="tab"]:has-text("Conversations")');
    await expect(conversationsTab).toHaveAttribute('data-state', 'active');
  });

  test('should switch to Sources tab and back', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search conversations"]');
    const sourcesTab = page.locator('button[role="tab"]:has-text("Sources")');
    const conversationsTab = page.locator('button[role="tab"]:has-text("Conversations")');
    await expect(searchInput).toBeVisible();
    await sourcesTab.click();
    await expect(searchInput).not.toBeVisible();
    await conversationsTab.click();
    await expect(searchInput).toBeVisible();
  });

  test('should clear search text when switching away from Conversations tab', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search conversations"]');
    const conversationsTab = page.locator('[role="tab"]', { hasText: 'Conversations' });
    const sourcesTab = page.locator('[role="tab"]', { hasText: 'Sources' });

    await searchInput.fill('test query');
    await expect(searchInput).toHaveValue('test query');
    
    // When switching to Sources tab, search should clear
    await sourcesTab.click();
    await conversationsTab.click();
    await expect(searchInput).toHaveValue('');
  });
});
