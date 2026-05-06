import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';
import { ProductPage } from './ProductPage';

export class HomePage extends BasePage {
  private readonly url = 'https://www.kriso.ee/';

  constructor(page: Page) {
    super(page);
  }

  async openUrl() {
    await this.page.goto(this.url);
  }

  async verifyNoProductsFoundMessage() {
    await expect(
      this.page.getByText(
        'Teie poolt sisestatud märksõnale vastavat raamatut ei leitud. Palun proovige uuesti!'
      )
    ).toBeVisible();
  }

  async getResultsCount(): Promise<number> {
    const text = await this.page
      .getByText(/Otsingu vasteid leitud:\s*\d+/)
      .first()
      .textContent();

    return Number((text || '').replace(/\D/g, '')) || 0;
  }

  async verifyResultsCountMoreThan(minCount: number) {
    const locator = this.page
      .getByText(/Otsingu vasteid leitud:\s*\d+/)
      .first();

    await expect(locator).toBeVisible();

    const total = await this.getResultsCount();
    expect(total).toBeGreaterThan(minCount);
  }

  async verifySearchResultsContainKeyword(keyword: string) {
    const results = this.page.getByText(new RegExp(keyword, 'i'));

    await expect(results.first()).toBeVisible();
    expect(await results.count()).toBeGreaterThan(1);
  }

  async verifyBookIsShown(bookTitle: string) {
    await expect(
      this.page.getByText(new RegExp(bookTitle, 'i')).first()
    ).toBeVisible();
  }

  async verifyMultipleProductsCanBeAddedToCart() {
    const addButtons = this.page.getByRole('link', { name: 'Lisa ostukorvi' });

    await expect(addButtons.first()).toBeVisible();
    expect(await addButtons.count()).toBeGreaterThan(1);
  }

  async addToCartByIndex(index: number) {
  const items = this.page.getByRole('link', { name: /Lisa ostukorvi/i });

  await expect(items.first()).toBeVisible({ timeout: 30000 });

  const count = await items.count();

  if (count === 0) {
    throw new Error(
      'No "Lisa ostukorvi" buttons found. Check that search/category is applied correctly.'
    );
  }

  if (index >= count) {
    throw new Error(`Not enough products. Found only ${count}, index ${index}`);
  }

  await items.nth(index).scrollIntoViewIfNeeded();
  await items.nth(index).click({ timeout: 30000 });

  // wait for cart update (IMPORTANT)
  await this.page.waitForTimeout(1000);
}

  async verifyAddToCartMessage() {
    await expect(
      this.page.getByText('Toode lisati ostukorvi')
    ).toBeVisible();
  }

  async openCartFromAddToCartMessage(): Promise<CartPage> {
    await this.page.getByRole('link', { name: /Mine ostukorvi/i }).click();
    await expect(this.page).toHaveURL(/basket/i);

    return new CartPage(this.page);
  }

  async returnToSearchResults(keyword: string) {
    await this.openUrl();
    await this.searchByKeyword(keyword);
  }

  // ✅ FIXED CATEGORY FLOW
  async openGuitarCategory(): Promise<ProductPage> {
    const music = this.page
      .getByRole('link', { name: 'Muusikaraamatud ja noodid' })
      .first();

    await music.click();

    const guitar = this.page
      .getByRole('link', { name: 'Kitarr' })
      .first();

    await expect(guitar).toBeVisible();
    await guitar.click();

    return new ProductPage(this.page);
  }
}