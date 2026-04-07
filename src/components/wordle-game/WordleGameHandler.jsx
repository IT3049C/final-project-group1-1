

export const config = {
    maxAttempts: 6,
    wordLength: 5
};

export const targetWord = getRandomWord();

export const gameState = {
    currentPosition: 0,
    currentAttempt: 0,
    targetWord: await getRandomWord(),
};

export function checkGuess(userGuess) {
    const isValid = isValidWord(userGuess);
    if (!isValid) {
        return !isValid;
    }

    const userGuessArray = userGuess.toUpperCase().split('');
    const targetWordArray = targetWord.toUpperCase().split('');

const results = userGuessArray.map((letter, index) => {
    if (letter === targetWordArray[index]) {
        return 'correct';
    } else if (targetWordArray.includes(letter)) {
        return 'misplaced';
    } else {
        return 'wrong';
    }
    });
    return results;
}

function isValidWord(word) {
return gameState.targetWord.includes(word.toLowerCase());
}

async function getRandomWord() {
try {
    const url = `https://random-word-api.herokuapp.com/word?length=${config.wordLength}`;
    const response = await fetch(url);
    const jsonifiedresponse = await response.json();
    return jsonifiedresponse[0];
} catch (error) {
    console.error('Error fetching random word:', error);
}
}