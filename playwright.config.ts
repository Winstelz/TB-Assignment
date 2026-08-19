
/// <reference types="node" />
import fs from 'fs';
import path from 'path';
// Load dotenv only if available to avoid crashing when it's not installed
declare const require: any;
const _dotenv = (() => {
  try {
    return require('dotenv');
  } catch (e) {
    console.warn('Optional dependency "dotenv" not found — skipping .env load.');
    return null;
  }
})();
import { defineConfig, devices } from '@playwright/test';

// Load .env from repo root (or custom via DOTENV_PATH)
const envFile = process.env.DOTENV_PATH || path.resolve(__dirname, '.env');
if (fs.existsSync(envFile)) {
  if (_dotenv) _dotenv.config({ path: envFile });
  else console.warn(`.env found at ${envFile} but dotenv is not installed; environment variables may not be loaded.`);
} else {
  // Helpful warning — tests may still run if CI provides envs
  console.warn(`.env not found at ${envFile}. Copy .env.example to .env if needed.`);
}

// Validate required env vars early to fail fast for local runs
const requiredEnv = ['TRUCKBASE_URL', 'TRUCKBASE_USERNAME', 'TRUCKBASE_PASSWORD'];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  if (!process.env.CI) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}.\nCopy .env.example to .env and set values, or set variables in your environment.`
    );
  } else {
    console.warn(`CI run: missing env vars: ${missing.join(', ')}`);
  }
}

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  // Keep the overall test budget generous so one slow suite does not fail unrelated cases.
  timeout: 600000,

  // 1 worker locally on the Chromebook, more in CI where resources are plentiful
  workers: isCI ? undefined : 1,

  expect: {
    timeout: 10000,
  },

  // Only cap failures locally so a bad local run doesn't burn your Chromebook;
  // let CI run everything so you get the full picture in Allure
  maxFailures: isCI ? undefined : 3,

  use: {
    headless: isCI ? true : false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,

    // Chromebook-only performance flags — omitted entirely in CI
    launchOptions: isCI
      ? {}
      : {
          args: [
            '--disable-gpu',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--js-flags=--max-old-space-size=512',
          ],
        },
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright'],
  ],
  outputDir: 'test-results',
});