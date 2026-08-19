import { Page, expect, Locator } from '@playwright/test';
import { url } from 'inspector/promises';

export class LoginPage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.getByRole('button', { name: /Sign In/i });
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginHeader = page.getByRole('heading', { name: /Sign In/i });
  }

  async goToLoginPage() {
    console.log({ message: 'Navigating to login page' });
    await this.page.goto(`${process.env.TRUCKBASE_URL}`, { timeout: 60000, waitUntil: 'networkidle' });
    await expect(this.loginHeader).toBeVisible({ timeout: 10000 });
  
  }

  async login(username: string, password: string) {
    console.log({ message: 'Filling in login credentials' });
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async waitForDashboard() {
    await this.page.waitForURL('**/dashboard');
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveTitle(/Dashboard/);
  }
}