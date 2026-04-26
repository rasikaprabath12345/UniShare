import { test, expect } from '@playwright/test';
import path from 'path';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign In →' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).fill('it23816718@my.sliit.lk');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Nanayakkara0716');
  await page.getByRole('button', { name: 'Sign In →' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Library' }).click();
  await page.getByRole('button', { name: 'All Notes' }).click();
  await page.getByRole('button', { name: 'My Notes' }).click();
  await page.getByRole('button', { name: 'All' }).nth(1).click();
  await page.getByRole('button', { name: 'Year 1' }).click();
  await page.getByRole('button', { name: 'Year 2' }).click();
  await page.getByRole('button', { name: 'Year 3' }).click();
  await page.getByRole('button', { name: 'All' }).nth(1).click();
  await page.getByRole('button', { name: 'All Notes' }).click();
  await page.getByRole('button', { name: 'Upload PDF' }).click();
  await page.getByText('Drag & drop your PDF hereor').click();

  await page.locator('input[type="file"]').setInputFiles(
    path.join(__dirname, 'uploads/7 - Frontend development overview.pdf')
  );

  await page.getByRole('textbox', { name: 'e.g. IT1201 Networking —' }).click();
  await page.getByRole('textbox', { name: 'e.g. IT1201 Networking —' }).fill('ITPM test1');
  await page.getByRole('combobox').first().selectOption('IT2105 — Programming');
  await page.getByRole('combobox').nth(1).selectOption('Year 1 — Semester 2');
  await page.getByRole('textbox', { name: 'Describe the topics covered,' }).click();
  await page.getByRole('textbox', { name: 'Describe the topics covered,' }).fill('ITPM test 1 pdf');
  await page.locator('.un-tags-wrap').click();
  await page.getByRole('textbox', { name: 'Type a tag and press Enter…' }).fill('itpm');
  await page.getByRole('textbox', { name: 'Type a tag and press Enter…' }).press('Enter');
  await page.getByRole('button', { name: '🌐 Public All students' }).click();
  await page.getByRole('button', { name: 'Publish Notes' }).click();
  await page.getByRole('button', { name: 'Upload Another' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();

  await page.getByRole('button', { name: 'My Notes' }).click();
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Delete' }).first().click();

  await page.locator('button.lib-delete-confirm').waitFor({ state: 'visible' });
  await page.locator('button.lib-delete-confirm').click();

  await page.getByRole('textbox', { name: 'Search notes, subjects,' }).click();
  await page.getByRole('textbox', { name: 'Search notes, subjects,' }).fill('test');
});