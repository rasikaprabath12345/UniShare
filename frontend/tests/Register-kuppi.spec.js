import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign In →' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).fill('it23842908@my.sliit.lk');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('12345678');
  await page.getByRole('button', { name: 'Sign In →' }).click();
  await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: 'Kuppi', exact: true }).click();
  await page.waitForLoadState('networkidle');

  // ✅ Change nth(2) → nth(0) or nth(1) based on debug output
  const registerBtn = page.getByRole('button', { name: 'Register' }).nth(0);
  await registerBtn.scrollIntoViewIfNeeded(); // handles off-screen buttons
  await registerBtn.click();

  await page.getByRole('textbox', { name: 'Briefly describe your' }).fill('how many hours');
  await page.getByRole('button', { name: 'Register for Meeting' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
});