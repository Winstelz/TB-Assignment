import { Page, expect, Locator } from '@playwright/test';

export class OrderInformationPage {
  readonly page: Page;
  readonly customerDropdown: Locator;
    readonly customerOrderNumberInput: Locator;


  constructor(page: Page) {
    this.page = page;
    this.customerDropdown = page.getByPlaceholder(/Search by customer name.../i);
    this.customerOrderNumberInput = page.locator('#customerOrderNumber');
}

async selectCustomer(customer: string) {
    console.log({ message: `Selecting ${customer}...` });
    await this.customerDropdown.click();

    // Type the customer name to filter options (if the control is a searchable input)
    await this.customerDropdown.pressSequentially(customer);
    // Wait for filtered option and click
    await this.page
    .getByRole('option', { name: new RegExp(customer, 'i') })
    .first()
    .click();
}
async enterCustomerOrderNumber(orderNumber: string) {
  console.log({ message: `Entering Customer Order Number...`});
  await this.customerOrderNumberInput.pressSequentially(orderNumber);
}

async fillOutNewOrderForm(customer: string, orderNumber: string) {
    console.log({ message: `Filling out New Order Form...`});
    await this.selectCustomer(customer);
    await this.enterCustomerOrderNumber(orderNumber);

    return {customer, orderNumber};
}
}
