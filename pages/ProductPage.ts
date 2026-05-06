import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  private readonly productTitle: Locator;
  private readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);

    this.productTitle = this.page.locator('h1');
    this.addToCartButton = this.page.getByRole('button', { name: /Lisa ostukorvi/i });
  }

  async verifyProductTitle(expected: string) {
    await expect(this.productTitle).toContainText(expected);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}