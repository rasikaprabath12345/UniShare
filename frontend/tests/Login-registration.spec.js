import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign In →' }).click();
  await page.getByRole('link', { name: 'Create an account' }).click();
  await page.getByRole('textbox', { name: 'e.g. Kavindu Perera' }).fill('Kavindu Kalhara');
  await page.getByRole('textbox', { name: 'IT21000000' }).fill('it23843123');
  await page.getByRole('textbox', { name: 'Min. 8 characters' }).fill('Rasika@12');
  await page.getByRole('textbox', { name: 'Re-enter password' }).fill('Rasika@12');
  await page.getByRole('button', { name: 'Create My Account →' }).click();
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign In →' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).fill('it23843134@my.sliit.lk');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Rasika@12');
  await page.getByRole('button', { name: 'Sign In →' }).click();
  await page.getByRole('button', { name: 'Sign Out' }).click();
});