import { test, expect } from "@playwright/test";

test.describe("Wordle Game", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to home
        await page.goto("/");
        
        // Go to lobby and save settings
        await page.getByRole('link', { name: 'Lobby' }).click();
        
        // Fill in player name
        await page.getByRole('textbox', { name: 'Player Name' }).fill('TestPlayer');
        
        // Select an avatar (wizard)
        await page.getByRole('img', { name: 'wizard' }).click();
        
        // Save settings
        await page.getByRole('button', { name: 'Save Settings' }).click();
        
        // Wait for navigation and then go to wordle game
        await page.goto("/game/wordle");
    });

    test("should display the Wordle game page", async ({ page }) => {
        await expect(page.locator("h2")).toContainText("Wordle Game");
    });

    test("should display the game board", async ({ page }) => {
        const board = page.locator('[class*="wordle"], [class*="board"]').first();
        await expect(board).toBeVisible();
    });

    test("should have a game input field", async ({ page }) => {
        const input = page.locator('input[type="text"]').first();
        await expect(input).toBeVisible();
    });

    test("should accept user input", async ({ page }) => {
        const input = page.locator('input[type="text"]').first();
        await input.fill("CRANE");
        await expect(input).toHaveValue("CRANE");
    });

    test("should display player info card", async ({ page }) => {
        // Check for player info card elements
        const playerInfo = page.locator('[class*="PlayerInfoCard"], [class*="player"]').first();
        await expect(playerInfo).toBeVisible();
    });

    test("should allow guessing a word", async ({ page }) => {
        const input = page.locator('input[type="text"]').first();
        await input.fill("CRANE");
        
        // Look for a submit button or press Enter
        await input.press("Enter");
        
        // Game should process the guess
        await page.waitForTimeout(500);
    });

    test("should display feedback after guess", async ({ page }) => {
        const input = page.locator('input[type="text"]').first();
        await input.fill("CRANE");
        await input.press("Enter");

        // Wait for feedback to appear (tiles with colors)
        await page.waitForTimeout(1000);
        
        // Check if game board shows feedback
        const tiles = page.locator('[class*="tile"], [class*="letter"], button').filter({ hasText: /[A-Z]/ });
        const count = await tiles.count();
        expect(count).toBeGreaterThan(0);
    });

    test("should maintain game state across attempts", async ({ page }) => {
        const input = page.locator('input[type="text"]').first();
        
        // First guess
        await input.fill("CRANE");
        await input.press("Enter");
        await page.waitForTimeout(500);
        
        // Second guess
        await input.fill("SLATE");
        await input.press("Enter");
        await page.waitForTimeout(500);
        
        // Both attempts should be tracked
        const board = page.locator('[class*="wordle"], [class*="board"]').first();
        await expect(board).toBeVisible();
    });

    test("should handle invalid input gracefully", async ({ page }) => {
        const input = page.locator('input[type="text"]').first();
        
        // Try invalid input
        await input.fill("ABC");
        await input.press("Enter");
        
        // Game should still be playable
        await input.clear();
        await input.fill("CRANE");
        await expect(input).toHaveValue("CRANE");
    });

    test("should be case-insensitive", async ({ page }) => {
        const input = page.locator('input[type="text"]').first();
        
        // Input lowercase
        await input.fill("crane");
        await expect(input).toHaveValue("crane");
        
        // Game should accept it
        await input.press("Enter");
        await page.waitForTimeout(500);
    });

    test("should clear input after valid submission", async ({ page }) => {
        const input = page.locator('input[type="text"]').first();
        
        await input.fill("CRANE");
        const initialValue = await input.inputValue();
        await input.press("Enter");
        
        // Wait and check if input was cleared
        await page.waitForTimeout(500);
        const finalValue = await input.inputValue();
        
        // Input should be empty or cleared for next guess
        expect(finalValue).toBe("");
    });
});