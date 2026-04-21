import { afterEach, describe, expect, test, vi } from 'vitest';
import { checkGuess, config, getRandomWord, isValidWord, normalizeGuess } from '../../components/wordle-game/WordleGameHandler';

describe('wordle helpers', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('normalizes guesses to uppercase trimmed text', () => {
        expect(normalizeGuess('  apple  ')).toBe('APPLE');
    });

    test('validates five-letter alphabetic words only', () => {
        expect(isValidWord('Apple')).toBe(true);
        expect(isValidWord('apple')).toBe(true);
        expect(isValidWord('appl')).toBe(false);
        expect(isValidWord('apple1')).toBe(false);
        expect(isValidWord(12345)).toBe(false);
    });

    test('scores exact matches as correct', () => {
        expect(checkGuess('APPLE', 'APPLE')).toEqual(Array(config.wordLength).fill('correct'));
    });

    test('scores misplaced and wrong letters using wordle rules', () => {
        expect(checkGuess('CRANE', 'NACRE')).toEqual([
            'misplaced',
            'misplaced',
            'misplaced',
            'misplaced',
            'correct',
        ]);
    });

    test('returns null for invalid guesses', () => {
        expect(checkGuess('TOO LONG', 'APPLE')).toBeNull();
        expect(checkGuess('APPLE', 'BAD')).toBeNull();
    });

    test('getRandomWord falls back to a deterministic list entry', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        await expect(getRandomWord()).resolves.toBe('APPLE');
    });
});