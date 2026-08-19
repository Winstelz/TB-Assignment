import { test as base, expect } from '@playwright/test';
import { OrdersPage } from '../src/pom/orders/orders';
import { OrderInformationPage } from '../src/pom/orders/orderInformation'; 
import { LoginPage } from '../src/pom/login';

const username = process.env.TRUCKBASE_USERNAME!;
const password = process.env.TRUCKBASE_PASSWORD!;

type PageObjects = {
  loginPage: LoginPage  
  ordersPage: OrdersPage;
  orderInformation: OrderInformationPage;

};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
 ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },
  orderInformation: async ({ page }, use) => {
    await use(new OrderInformationPage(page));
  },

});
 test.beforeAll(async ({ browser, loginPage }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await loginPage.goToLoginPage();
  await loginPage.login(username, password);
  await page.context().storageState({ path: 'auth.json' });
  await context.close();
});
// apply the saved state to all tests in this file
test.use({ storageState: 'auth.json' });

  test('Create an Order', async ({ordersPage, orderInformation}) => {
    //Click on Orders Tab
    await ordersPage.clickOrdersPage();
    //Click New Load
    await ordersPage.clickNewLoadButton();
    //Fill out New Order Form
    await orderInformation.fillOutNewOrderForm("Acme Broker", "1234");




     });
 