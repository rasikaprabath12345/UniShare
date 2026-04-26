import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign In →' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).fill('IT23816718@my.sliit.lk');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Nanayakkara0716');
  await page.getByRole('button', { name: 'Sign In →' }).click();
  await page.waitForLoadState('networkidle');

  await page.getByRole('navigation').getByRole('link', { name: 'Quiz' }).click();
  await page.waitForLoadState('networkidle');

  await page.locator('.qz-mat-thumb-overlay').first().click();
  await page.waitForLoadState('networkidle');

  // ✅ Fix — new tab නෑ, same page එකේ load වෙනවා
  await page.getByRole('button', { name: 'Generate Quiz' }).click();
  await page.waitForLoadState('networkidle');

  await page.getByText('Client-side development').click();
  await page.getByText('It is not important').click();
  await page.getByText('DHTML, PHP, MySQL').click();
  await page.getByText('AAn object-oriented').click();
  await page.getByText('A JavaScript library for').nth(1).click();
  await page.getByText('Models').click();
  await page.getByText('The structure of the application', { exact: true }).click();
  await page.getByText('CIt affects the user').click();
  await page.getByText('DA JavaScript framework for').nth(1).click();
  await page.getByText('AWhen you have large amounts').click();
  await page.getByText('Props and state are the same').click();
  await page.getByText('Functions that are called in response to network actions').click();
  await page.getByText('ATo provide a structure for').click();
  await page.getByText('A JavaScript framework for').nth(4).click();
  await page.getByText('DTo manage and manipulate the').click();
  await page.getByText('Local state management is used for small applications, while global state').click();
  await page.getByText('To improve the structure of').click();
  await page.getByText('AA component is a reusable').click();
  await page.getByText('CTo provide a list of the top').click();
  await page.getByText('To provide an additional layer of security for network applications').click();

  await page.getByRole('button', { name: 'Submit Quiz' }).click();
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'My Quiz History' }).click();
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: '← Back to Quiz' }).click();
});