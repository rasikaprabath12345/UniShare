import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign In →' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).click();
  await page.getByRole('textbox', { name: 'it21xxxxxx@my.sliit.lk' }).fill('it23859760@my.sliit.lk');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('kl@#1360');
  await page.getByRole('button', { name: 'Sign In →' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Forum' }).click();
  await page.getByRole('button', { name: 'Read more' }).first().click();
  await page.getByRole('button', { name: 'Like' }).click();
  await page.getByRole('textbox', { name: 'Add your comment or answer...' }).click();
  await page.getByRole('textbox', { name: 'Add your comment or answer...' }).fill('test comment 2');
  await page.getByRole('button', { name: 'Post Comment' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Delete comment' }).nth(4).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('test topic test test comment2');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByRole('button', { name: 'Back to Forum' }).click();
  await page.getByRole('button', { name: '🌐 Networking' }).click();
  await page.getByRole('button', { name: '💻 Programming' }).click();
  await page.getByRole('textbox', { name: 'Search discussions, topics,' }).click();
  await page.getByRole('textbox', { name: 'Search discussions, topics,' }).fill('test');
  await page.getByText('UniShareHomeLibraryKuppiQuizForumAboutHKhimasha kalhraStudent Discussions My').click();
  await page.getByRole('button', { name: '💬 All' }).click();
});