import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../src/pom/login';

type PageObjects = {
  loginPage: LoginPage  

};
export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
 test.beforeEach(async ({ loginPage }) => {
  await loginPage.goToLoginPage();
  });

  test('User can successfully login with valid credentials', async ({ loginPage }) => {
    const username = process.env.TRUCKBASE_USERNAME!;
    const password = process.env.TRUCKBASE_PASSWORD!;

    // Login
    await loginPage.goToLoginPage();
    await loginPage.login(username, password);
    await loginPage.waitForDashboard();

    // Assert
    await loginPage.assertLoginSuccess();
  });
