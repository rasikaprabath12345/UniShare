import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign In →' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).fill('it23842908@my.sliit.lk');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('12345678');
  await page.getByRole('button', { name: 'Sign In →' }).click();
  await page.getByRole('link', { name: 'Kuppi', exact: true }).click();
  await page.getByRole('button', { name: 'My Meetings' }).click();
  await page.getByRole('button', { name: 'Edit' }).nth(2).click();
  await page.locator('input[name="title"]').click();
  await page.locator('input[name="title"]').fill('Introduction to Sciense');
  await page.getByRole('button', { name: 'Save Changes' }).click();

  await page.waitForSelector('.modal-backdrop', { state: 'hidden' });

  await page.getByRole('button', { name: 'Delete' }).nth(2).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Delete' }).nth(2).click();

  await page.getByRole('button', { name: 'Yes, Delete' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Yes, Delete' }).click();

  await page.waitForSelector('.modal-backdrop', { state: 'hidden' });

  await page.getByRole('button', { name: 'Save' }).nth(3).click();
  await page.getByRole('button', { name: 'Saved Sessions' }).click();
  await page.getByRole('button', { name: 'Remove Bookmark' }).first().click();
});