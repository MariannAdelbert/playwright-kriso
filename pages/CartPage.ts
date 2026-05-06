import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartQty: Locator;
  private readonly cartSubtotals: Locator;
  private readonly cartTotal: Locator;
  private readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.cartQty = this.page.locator('.order-qty > .o-value');
    this.cartSubtotals = this.page.locator('.tbl-row > .subtotal');
    this.cartTotal = this.page.locator('.order-total > .o-value');
    this.removeButton = this.page.locator('.icon-remove');
  }

  async verifyCartCount(expected: number) {
    await expect(this.cartQty.first()).toContainText(String(expected));
  }

  async verifyCartSumIsCorrect() {
    const items = await this.cartSubtotals.all();

    let sum = 0;

    for (const item of items) {
      const text = await item.textContent();
      const price = Number((text || '').replace(/[^0-9.,]+/g, '').replace(',', '.')) || 0;
      sum += price;
    }

    const totalText = await this.cartTotal.textContent();
    const total = Number((totalText || '').replace(/[^0-9.,]+/g, '').replace(',', '.')) || 0;

    expect(total).toBeCloseTo(sum, 2);

    return sum;
  }

  async removeItemByIndex(index: number) {
    await this.removeButton.nth(index).click();
  }
}