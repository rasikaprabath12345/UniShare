import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign In →' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).fill('it23843134@my.sliit.lk');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Rasika@12');
  await page.getByRole('button', { name: 'Sign In →' }).click();
  await page.getByRole('button', { name: 'Reports' }).click();
  await page.getByRole('button', { name: 'Review' }).first().click();
  await page.getByRole('button', { name: 'Approve Report' }).click();
  await page.getByRole('button', { name: 'Send Warning' }).click();
  await page.getByRole('textbox', { name: 'Enter warning message for the' }).fill('warning');
  await page.getByRole('button', { name: 'Confirm Warning' }).click();
  await page.getByRole('button', { name: 'Review' }).nth(2).click();
  await page.getByRole('button', { name: 'Reject Report' }).click();
});