import { test, expect } from '@playwright/test';

test('homepage loads and shows title text', async ({ page }) => {
  // Go to your frontend app
  await page.goto('http://localhost:3000');

  // Check the page title matches your actual app name
  await expect(page).toHaveTitle('AI-PPLY');

  // Check if the root app element is visible
  const root = page.locator('#root');
  await expect(root).toBeVisible();
});