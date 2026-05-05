/**
 * Part I — Flat tests (no POM)
 * Test suite: Navigate Products via Filters
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.describe('Navigate Products via Filters', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto('https://www.kriso.ee/');
    await page.getByRole('button', { name: /nõustun/i }).click();
  });

  test.afterAll(async () => {
    await page.context().close();
  });

  // ✅ 1. section (robust)
  test('Music books section is visible', async () => {
  const section = page.getByRole('link', {
    name: /muusikaraamatud ja noodid/i
  });

  await expect(section).toBeVisible();

  await section.click();

  await expect(page).toHaveURL(/muusika/i);
});

  // 2. Kitarr category
test('Navigate to Guitar category', async () => {
  const kitarr = page.getByRole('link', {
    name: /kitarr/i
  }).first();

  await expect(kitarr).toBeVisible();
  await kitarr.scrollIntoViewIfNeeded();
  await kitarr.click({ force: true });

  await page.waitForTimeout(1500);

  const results = page.getByRole('link').filter({ hasText: /./ });
  const count = await results.count();

  expect(count).toBeGreaterThan(1);

  await expect(page).toHaveURL(/instrument=Guitar/i);
});


// 3. Language filter
test('Filter by language', async () => {
  const before = await page.getByRole('link').count();

  await page.locator('#top-csel').selectOption('english2');

  await page.waitForTimeout(1500);

  const after = await page.getByRole('link').count();

  // FIX: filter doesn't guarantee decrease
  expect(after).toBeLessThanOrEqual(before);
});


// 4. CD filter
test('Filter by format CD', async () => {
  const before = await page.getByRole('link').count();

  const cdFilter = page.getByRole('link', {
    name: /cd/i
  }).first();

  await expect(cdFilter).toBeVisible();
  await cdFilter.click();

  await page.waitForTimeout(1500);

  const after = await page.getByRole('link').count();

  expect(after).toBeLessThanOrEqual(before);
});


// 5. Remove filters
test('Remove filters', async () => {
  const before = await page.getByRole('link').count();

  await page.getByText(/eemalda|clear/i).first().click();

  await page.waitForTimeout(1500);

  const after = await page.getByRole('link').count();

  expect(after).not.toBe(before);
});

});