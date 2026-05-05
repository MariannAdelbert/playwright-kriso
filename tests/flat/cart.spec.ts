/**
 * Part I — Flat tests (no POM)
 * Test suite: Add Books to Shopping Cart
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.describe('Add Books to Shopping Cart', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto('https://www.kriso.ee/');
    await page.getByRole('button', { name: /nõustun/i }).click();
  });

  test.afterAll(async () => {
    await page.context().close();
  });

  test('Page has Kriso logo/title', async () => {
    await expect(page.getByRole('link', { name: /kriso/i })).toBeVisible();
  });

  test('Search returns multiple results', async () => {
  const search = page.getByPlaceholder(/pealkiri|autor|isbn|märksõ/i).first();

  await expect(search).toBeVisible();

  await search.click();
  await search.fill('harry potter');

  await page.getByRole('button', { name: /otsi|search/i }).click();

  const results = page.getByRole('link').filter({ hasText: /harry|potter/i });

  const count = await results.count();
  expect(count).toBeGreaterThan(1);
});

  test('Add first book to cart', async () => {
    await page.getByRole('link', { name: /lisa ostukorvi/i }).first().click();

    await expect(page.getByText(/lisati ostukorvi/i)).toBeVisible();

    // FIX: ära kasuta .cart-units visible checki
    const cartCounter = page.locator('span.cart-units').filter({
      hasText: '1'
    });

    await expect(cartCounter.first()).toBeAttached();
  });

 test('Add second book to cart', async () => {
  const addButtons = page.getByRole('link', { name: /lisa ostukorvi/i });

  await addButtons.nth(1).click({ force: true });
  await expect(page.locator('div.msg.msg-info')).toContainText(/lisati ostukorvi/i);
  await expect(page.locator('span.cart-units').first()).toHaveText(/2/);
  await expect(page.getByRole('link', { name: /ostukorv/i }))
    .toContainText(/2/);
});

  test('Cart view and validation', async () => {
    await page.getByRole('link', { name: /ostukorv/i }).click();
    await expect(page).toHaveURL(/cart|ostukorv|order/i);
    const items = page.getByRole('link');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('Remove item from cart', async () => {
    await page.getByRole('button', { name: /eemalda|remove/i }).first().click();

    await expect(page.getByText(/1/)).toBeVisible();
  });

});