import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getHighscores, loadSettings, saveSettings, setHighscores } from "../settings";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe("settings storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("localStorage", localStorageMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("saveSettings writes serialized settings", () => {
    const settings = { theme: "dark", sound: true };

    saveSettings(settings);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "game.settings",
      JSON.stringify(settings),
    );
  });

  test("loadSettings returns parsed object when stored", () => {
    const settings = { theme: "light", sound: false };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(settings));

    const loaded = loadSettings();

    expect(localStorageMock.getItem).toHaveBeenCalledWith("game.settings");
    expect(loaded).toEqual(settings);
  });

  test("loadSettings returns null when missing", () => {
    localStorageMock.getItem.mockReturnValue(null);

    expect(loadSettings()).toBeNull();
  });

  test("loadSettings returns null when malformed", () => {
    localStorageMock.getItem.mockReturnValue("not-json");

    expect(loadSettings()).toBeNull();
  });

  test("getHighscores returns parsed list when stored", () => {
    const highscores = [
      { name: "Player1", score: 100 },
      { name: "Player2", score: 50 },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(highscores));

    const list = getHighscores();

    expect(localStorageMock.getItem).toHaveBeenCalledWith("game.highscores");
    expect(list).toEqual(highscores);
  });

  test("getHighscores returns empty list when missing", () => {
    localStorageMock.getItem.mockReturnValue(null);

    expect(getHighscores()).toEqual([]);
  });

  test("getHighscores returns empty list when malformed", () => {
    localStorageMock.getItem.mockReturnValue("oops");

    expect(getHighscores()).toEqual([]);
  });

  test("setHighscores writes serialized list", () => {
    const highscores = [{ name: "Player1", score: 100 }];

    setHighscores(highscores);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "game.highscores",
      JSON.stringify(highscores),
    );
  });
});
