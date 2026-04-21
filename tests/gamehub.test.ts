import { test, expect, type Page } from "@playwright/test";

test.describe("Main page", () => {
	async function login(page: Page) {
		await page.goto("/");
		await page.getByRole("link", { name: "Lobby" }).click();
		await page.getByRole("textbox", { name: "Player Name" }).fill("TestPlayer");
		await page.getByRole("img", { name: "wizard" }).click();
		await page.getByRole("button", { name: "Save Settings" }).click();
	}

	test.beforeEach(async ({ page }) => {
		await login(page);
		await page.goto("/");
	});

	test("renders app shell and home content", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Welcome to the Games Lobby" })
		).toBeVisible();
		await expect(page.getByRole("heading", { name: "Available Games" })).toBeVisible();
		await expect(page.getByRole("heading", { name: "Find a game" })).toBeVisible();
	});


	test("filters games from search input", async ({ page }) => {
		const searchInput = page.locator("#game-search");
		await searchInput.fill("wordle");

		const gameLinks = page.locator("section").last().locator("li a");
		await expect(gameLinks).toHaveCount(0);
		await expect(page).toHaveURL(/search=wordle/i);
	});
});
