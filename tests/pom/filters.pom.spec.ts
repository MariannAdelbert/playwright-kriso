import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe.configure({ mode: 'serial' });

test.describe('Navigate Products via Filters (POM)', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);

    await homePage.openUrl();
    await homePage.acceptCookies();
  });

  test('Navigate to Kitarr category', async () => {
    await homePage.openGuitarCategory();
  });
});