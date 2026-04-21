import { test, expect } from '@playwright/test';

test('navigate to rps and play rock then reset', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  // Go to lobby and save settings
  await page.getByRole('link', { name: 'Lobby' }).click();
  await page.getByRole('textbox', { name: 'Player Name' }).click();
  await page.getByRole('textbox', { name: 'Player Name' }).fill('John Doe');
  await page.getByRole('img', { name: 'wizard' }).click();
  await page.getByRole('button', { name: 'Save Settings' }).click();
  // Click on the RPS navlink
  await page.getByRole('navigation').getByRole('link', { name: 'Rock Paper Scissors' }).click();
  // Page contains the necessary information
  await expect(page.getByRole('heading', { name: 'Rock Paper Scissors' })).toBeVisible();
  await expect(page.locator('#root')).toContainText('Rock Paper Scissors');
  await expect(page.getByRole('region', { name: 'Player Info' })).toBeVisible();
  await expect(page.locator('#player-name')).toContainText('John Doe');
  await expect(page.getByRole('img', { name: 'Player avatar' })).toBeVisible();
  // History is added when a move is made and cleared on reset
  await page.getByRole('button', { name: 'Rock' }).click();
  await expect(page.locator('#history')).toBeVisible();
  await expect(page.locator('#history li').first()).toContainText(/Player\(rock\) vs CPU\(/);
  await page.getByRole('button', { name: 'Reset Game' }).click();
  await expect(page.locator('#history')).not.toBeVisible();
});