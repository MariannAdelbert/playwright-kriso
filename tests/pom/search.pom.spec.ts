import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe.configure({ mode: 'serial' });

test.describe('Search for Books by Keywords (POM)', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);

    await homePage.openUrl();
    await homePage.acceptCookies();
  });

  test('Search "tolkien"', async () => {
    await homePage.searchByKeyword('tolkien');
    await homePage.verifyResultsCountMoreThan(1);
    await homePage.verifySearchResultsContainKeyword('tolkien');
  });

  test('Search invalid keyword shows no results', async () => {
    await homePage.searchByKeyword('xqzwmfkj');
    await homePage.verifyNoProductsFoundMessage();
  });

  test('Search ISBN shows correct book', async () => {
    await homePage.searchByKeyword('9780307588371');
    await homePage.verifyBookIsShown('Gone Girl');
  });
});