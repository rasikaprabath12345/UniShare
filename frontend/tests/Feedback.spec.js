import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign In →' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).fill('it23816718@my.sliit.lk');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Nanayakkara0716');
  await page.getByRole('button', { name: 'Sign In →' }).click();
  await page.getByRole('button', { name: 'Feedback' }).click();
  await page.getByRole('textbox', { name: 'Tell us what you love, what' }).fill('Test feedback');

  // Click the svg directly (not the inner path) with force to bypass pointer-events interception
  await page.locator('.lucide-star.fb-star').first().click({ force: true });

  await page.getByRole('button', { name: 'Submit Feedback' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
});