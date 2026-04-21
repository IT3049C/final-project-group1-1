import { test, expect } from '@playwright/test';

async function login(page) {
	await page.goto('/');
	await page.getByRole('link', { name: 'Lobby' }).click();
	await page.getByRole('textbox', { name: 'Player Name' }).fill('TestPlayer');
	await page.getByRole('img', { name: 'wizard' }).click();
	await page.getByRole('button', { name: 'Save Settings' }).click();
}

test('redirects to lobby when not signed in', async ({ page }) => {
	await page.goto('/game/tic-tac-toe');
	await expect(page).toHaveURL(/\/lobby$/);
	await expect(page.getByRole('heading', { name: 'Player Settings' })).toBeVisible();
});

test('loads tic-tac-toe multiplayer page after login', async ({ page }) => {
	await login(page);

	await page.getByRole('navigation').getByRole('link', { name: 'Tic Tac Toe' }).click();

	await expect(page.getByRole('heading', { name: 'Tic-Tac-Toe Multiplayer' })).toBeVisible();
	await expect(page.locator('.room-summary').first()).toContainText('Signed in as TestPlayer.');

	const roomInput = page.getByPlaceholder('Enter a room ID');
	await expect(roomInput).toBeVisible();
	await expect(page.getByRole('button', { name: 'Create Room' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Join Room' })).toBeVisible();

	await expect(page.locator('.game-info')).toContainText('Waiting for a room');
	await expect(page.locator('.game-info')).toContainText('Your mark: spectator');
	await expect(page.locator('.game-info')).toContainText('Version: 0');

	await expect(page.locator('.square')).toHaveCount(9);
});
