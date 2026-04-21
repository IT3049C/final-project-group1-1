
export const config = {
    maxAttempts: 6,
    wordLength: 5,
};

const FALLBACK_WORDS = [
    'APPLE',
    'DREAM',
    'GHOST',
    'LEMON',
    'MANGO',
    'NINJA',
    'QUEST',
    'ROBOT',
    'TRAIN',
    'WATER',
    'ZEBRA',
];

export function isValidWord(word) {
    if (typeof word !== 'string') {
        return false;
    }

    const normalized = word.trim().toUpperCase();
    return normalized.length === config.wordLength && /^[A-Z]+$/.test(normalized);
}

export function normalizeGuess(word) {
    return (word || '').trim().toUpperCase();
}

export function checkGuess(guess, targetWord) {
    const normalizedGuess = normalizeGuess(guess);
    const normalizedTarget = normalizeGuess(targetWord);

    if (!isValidWord(normalizedGuess) || !isValidWord(normalizedTarget)) {
        return null;
    }

    const results = Array(config.wordLength).fill('wrong');
    const targetChars = normalizedTarget.split('');
    const guessChars = normalizedGuess.split('');

    for (let index = 0; index < config.wordLength; index++) {
        if (guessChars[index] === targetChars[index]) {
            results[index] = 'correct';
            targetChars[index] = null;
            guessChars[index] = null;
        }
    }

    for (let index = 0; index < config.wordLength; index++) {
        if (!guessChars[index]) {
            continue;
        }

        const misplacedIndex = targetChars.indexOf(guessChars[index]);
        if (misplacedIndex !== -1) {
            results[index] = 'misplaced';
            targetChars[misplacedIndex] = null;
        }
    }

    return results;
}

function getFallbackWord() {
    const index = Math.floor(Math.random() * FALLBACK_WORDS.length);
    return FALLBACK_WORDS[index];
}

export async function getRandomWord() {
    // try {
    //     const url = `https://random-word-api.herokuapp.com/word?length=${config.wordLength}`;
    //     const response = await fetch(url);

    //     if (!response.ok) {
    //         throw new Error(`Word API request failed (${response.status})`);
    //     }

    //     const payload = await response.json();
    //     const candidate = normalizeGuess(payload?.[0]);

    //     if (isValidWord(candidate)) {
    //         return candidate;
    //     }
    // } catch (error) {
    //     console.error('Error fetching random word:', error);
    // }

    return getFallbackWord();
}