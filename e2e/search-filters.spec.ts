import { test, expect } from '@playwright/test';

test.describe('Search Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to conversations tab
    await page.getByRole('tab', { name: /conversations/i }).click();
  });

  test('can open filters dropdown', async ({ page }) => {
    // Click the Filters button
    const filtersButton = page.getByRole('button', { name: /filters/i });
    await filtersButton.click();
    
    // Filter menu should be visible
    await expect(page.getByText(/date range/i)).toBeVisible();
    await expect(page.getByText(/source type/i)).toBeVisible();
  });

  test('can filter by date range - Today', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Select "Today"
    await page.getByRole('menuitem', { name: /today/i }).click();
    
    // Filter badge should appear
    await expect(page.getByText('Today')).toBeVisible();
    
    // Filter count badge should show
    const filtersButton = page.getByRole('button', { name: /filters/i });
    await expect(filtersButton).toContainText('1');
  });

  test('can filter by date range - Last 7 days', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Select "Last 7 days"
    await page.getByRole('menuitem', { name: /last 7 days/i }).click();
    
    // Filter badge should appear
    await expect(page.getByText('Last 7 days')).toBeVisible();
  });

  test('can filter by date range - Last 30 days', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Select "Last 30 days"
    await page.getByRole('menuitem', { name: /last 30 days/i }).click();
    
    // Filter badge should appear
    await expect(page.getByText('Last 30 days')).toBeVisible();
  });

  test('can filter by source type - Files only', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Select "Files only"
    await page.getByRole('menuitem', { name: /files only/i }).click();
    
    // Filter badge should appear
    await expect(page.getByText('Files')).toBeVisible();
  });

  test('can filter by source type - URLs only', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Select "URLs only"
    await page.getByRole('menuitem', { name: /urls only/i }).click();
    
    // Filter badge should appear
    await expect(page.getByText('URLs')).toBeVisible();
  });

  test('can filter by source type - No sources', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Select "No sources"
    await page.getByRole('menuitem', { name: /no sources/i }).click();
    
    // Filter badge should appear
    await expect(page.getByText('No sources')).toBeVisible();
  });

  test('can apply multiple filters', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Select date filter
    await page.getByRole('menuitem', { name: /last 7 days/i }).click();
    
    // Open filters again
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Select source type filter
    await page.getByRole('menuitem', { name: /files only/i }).click();
    
    // Both filter badges should appear
    await expect(page.getByText('Last 7 days')).toBeVisible();
    await expect(page.getByText('Files')).toBeVisible();
    
    // Filter count should be 2
    const filtersButton = page.getByRole('button', { name: /filters/i });
    await expect(filtersButton).toContainText('2');
  });

  test('can remove individual filter from badge', async ({ page }) => {
    // Apply a filter
    await page.getByRole('button', { name: /filters/i }).click();
    await page.getByRole('menuitem', { name: /today/i }).click();
    
    // Filter badge should be visible
    const filterBadge = page.getByText('Today');
    await expect(filterBadge).toBeVisible();
    
    // Click X button on the badge
    const removeButton = filterBadge.locator('..').getByRole('button');
    await removeButton.click();
    
    // Filter badge should be gone
    await expect(filterBadge).not.toBeVisible();
  });

  test('can clear all filters', async ({ page }) => {
    // Apply multiple filters
    await page.getByRole('button', { name: /filters/i }).click();
    await page.getByRole('menuitem', { name: /last 7 days/i }).click();
    
    await page.getByRole('button', { name: /filters/i }).click();
    await page.getByRole('menuitem', { name: /files only/i }).click();
    
    // Open filters again
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Click "Clear all filters"
    await page.getByRole('menuitem', { name: /clear all filters/i }).click();
    
    // All filter badges should be gone
    await expect(page.getByText('Last 7 days')).not.toBeVisible();
    await expect(page.getByText('Files')).not.toBeVisible();
    
    // Filter count badge should be gone
    const filtersButton = page.getByRole('button', { name: /filters/i });
    await expect(filtersButton).not.toContainText('1');
    await expect(filtersButton).not.toContainText('2');
  });

  test('filters work with search query', async ({ page }) => {
    // Type in search
    const searchInput = page.getByPlaceholder(/search conversations/i);
    await searchInput.fill('test');
    
    // Apply a filter
    await page.getByRole('button', { name: /filters/i }).click();
    await page.getByRole('menuitem', { name: /last 7 days/i }).click();
    
    // Both search and filter should be active
    await expect(searchInput).toHaveValue('test');
    await expect(page.getByText('Last 7 days')).toBeVisible();
  });

  test('toggle filter on/off', async ({ page }) => {
    // Apply a filter
    await page.getByRole('button', { name: /filters/i }).click();
    await page.getByRole('menuitem', { name: /today/i }).click();
    
    // Filter should be active
    await expect(page.getByText('Today')).toBeVisible();
    
    // Click same filter again to toggle off
    await page.getByRole('button', { name: /filters/i }).click();
    await page.getByRole('menuitem', { name: /✓ today/i }).click();
    
    // Filter should be removed
    await expect(page.getByText('Today')).not.toBeVisible();
  });

  test('filter indicators show in dropdown', async ({ page }) => {
    // Apply filters
    await page.getByRole('button', { name: /filters/i }).click();
    await page.getByRole('menuitem', { name: /last 7 days/i }).click();
    
    // Open filters again
    await page.getByRole('button', { name: /filters/i }).click();
    
    // Active filter should have checkmark
    await expect(page.getByRole('menuitem', { name: /✓ last 7 days/i })).toBeVisible();
  });

  test('filters persist when switching tabs', async ({ page }) => {
    // Apply a filter
    await page.getByRole('button', { name: /filters/i }).click();
    await page.getByRole('menuitem', { name: /today/i }).click();
    
    // Switch to sources tab
    await page.getByRole('tab', { name: /sources/i }).click();
    
    // Switch back to conversations
    await page.getByRole('tab', { name: /conversations/i }).click();
    
    // Filter should still be active
    await expect(page.getByText('Today')).toBeVisible();
  });
});
