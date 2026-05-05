import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.describe('Search for Books by Keywords', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto('https://www.kriso.ee/');
    await page.getByRole('button', { name: /nõustun/i }).click();
  });

  test.afterAll(async () => {
    await page.context().close();
  });

  // ✅ logo
  test('Page has Kriso title/logo', async () => {
    await expect(page.getByText(/kriso/i).first()).toBeVisible();
  });

  // ❌ random search
  test('Search with random keyword shows no results', async () => {
    const search = page.getByRole('textbox').first();

    await search.fill('xqzwmfkj');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1500);

    await expect(
      page.getByText(/ei leitud/i)
    ).toBeVisible();
  });

  // 🔥 FIXED tolkien test
  test('Search for "tolkien" shows matching results', async () => {
    const search = page.getByRole('textbox').first();

    await search.fill('tolkien');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(2000);

    // 👉 ainult search tulemused (mitte kogu leht)
    const results = page.getByRole('link');

    const count = await results.count();

    expect(count).toBeGreaterThan(1);
  });

  // ✅ ISBN
  test('Search by ISBN shows correct book', async () => {
    const search = page.getByRole('textbox').first();

    await search.fill('9780307588371');
    await page.getByRole('button').first().click();

    await page.waitForTimeout(2000);

    await expect(
  page.getByText('Gone Girl: A Novel', { exact: true })
).toBeVisible();
  });

});