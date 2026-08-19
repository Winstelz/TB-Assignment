import { Page, expect, Locator } from '@playwright/test';

export class OrdersPage {
  readonly page: Page;
  readonly ordersButton: Locator;
  readonly newLoadButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.ordersButton = page.getByRole('button', { name: /Orders/i });
    this.newLoadButton = page.getByRole('button', {name: /New load/i})
    
  }

async clickOrdersPage() {
    console.log({ message: 'Navigating to orders page' });
    await this.ordersButton.click();
    await this.page.waitForURL('**/all-orders');
  }

async assertOrdersPage() {
    await expect(this.page).toHaveTitle(/Orders/);
  }

async clickNewLoadButton() {
  console.log({ message: 'Clicking New Load....' });
  await this.newLoadButton.click();
}



}
