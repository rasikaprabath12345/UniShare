import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Increase timeout for navigation (especially for Firefox)
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  await page.getByRole('link', { name: 'Sign In →' }).click();

  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).fill('it23859760@my.sliit.lk');

  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('kl@#1360');

  await page.getByRole('button', { name: 'Sign In →' }).click();

  // Wait for navigation after sign in
  await page.waitForLoadState('domcontentloaded');

  await page.getByRole('navigation').getByRole('link', { name: 'Forum' }).click();
  await page.waitForLoadState('domcontentloaded');

  await page.getByRole('button', { name: 'New Discussion' }).click();

  await page.getByRole('combobox').selectOption('Networking');

  await page.getByRole('textbox', { name: "What's your question or topic?" }).click();
  await page.getByRole('textbox', { name: "What's your question or topic?" }).fill('test topic');

  await page.getByRole('textbox', { name: 'Describe your question in' }).click();
  await page.getByRole('textbox', { name: 'Describe your question in' }).fill('test test testtest test test');

  await page.getByRole('textbox', { name: 'e.g. SQL, joins, indexing' }).click();
  await page.getByRole('textbox', { name: 'e.g. SQL, joins, indexing' }).fill('sql,java');

  await page.getByRole('button', { name: 'Post discussion' }).click();

  // Wait to confirm post was submitted
  await page.waitForLoadState('domcontentloaded');
});