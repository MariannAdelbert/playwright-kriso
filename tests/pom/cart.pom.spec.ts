import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';

test.describe.configure({ mode: 'serial' });

test.describe('Add Books to Shopping Cart (POM)', () => {
  let homePage: HomePage;
  let cartPage: CartPage;
  let sum1 = 0;
  let sum2 = 0;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);

    await homePage.openUrl();
    await homePage.acceptCookies();
  });

  test('Search has results', async () => {
    await homePage.searchByKeyword('harry potter');
    await homePage.verifyMultipleProductsCanBeAddedToCart();
  });

  test('Add first item', async () => {
    await homePage.searchByKeyword('harry potter');
    await homePage.addToCartByIndex(0);
    await homePage.verifyAddToCartMessage();
  });

  test('Add second item', async () => {
    await homePage.searchByKeyword('harry potter');
    await homePage.addToCartByIndex(1);
    await homePage.verifyAddToCartMessage();
  });

  test('Verify cart has 2 items and sum', async () => {
    cartPage = await homePage.openCartFromAddToCartMessage();

    await cartPage.verifyCartCount(2);
    sum2 = await cartPage.verifyCartSumIsCorrect();
  });

  test('Remove item and verify update', async () => {
    await cartPage.removeItemByIndex(0);

    await cartPage.verifyCartCount(1);
    sum1 = await cartPage.verifyCartSumIsCorrect();

    expect(sum1).toBeLessThan(sum2);
  });
});