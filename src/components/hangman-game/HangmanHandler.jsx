import { useMemo, useState } from 'react';
import { HangmanUI } from './HangmanUI';

const config = {
    maxWrongGuesses: 7,
    failedWord: 'HANGMAN',
};

const FALLBACK_WORDS = [
    'JAVASCRIPT',
    'REACT',
    'COMPONENT',
    'FUNCTION',
    'VARIABLE',
    'BROWSER',
    'KEYBOARD',
    'COMPUTER',
    'PROGRAM',
    'NETWORK',
];

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * FALLBACK_WORDS.length);
    return FALLBACK_WORDS[randomIndex];
}

function createInitialState() {
    return {
        word: getRandomWord(),
        guessedLetters: [],
        wrongGuesses: 0,
        status: 'playing',
    };
}

export function HangmanHandler() {
    const [gameState, setGameState] = useState(createInitialState);

    const uniqueLetters = useMemo(() => new Set(gameState.word.split('')), [gameState.word]);

    const handleGuess = (letter) => {
        setGameState((previousState) => {
            if (previousState.status !== 'playing') {
                return previousState;
            }

            if (previousState.guessedLetters.includes(letter)) {
                return previousState;
            }

            const nextGuessedLetters = [...previousState.guessedLetters, letter];
            const isWrongGuess = !previousState.word.includes(letter);
            const nextWrongGuesses = isWrongGuess
                ? previousState.wrongGuesses + 1
                : previousState.wrongGuesses;

            const hasWon = [...new Set(previousState.word.split(''))].every((char) =>
                nextGuessedLetters.includes(char)
            );
            const hasLost = nextWrongGuesses >= config.maxWrongGuesses;

            let nextStatus = 'playing';
            if (hasWon) {
                nextStatus = 'won';
            } else if (hasLost) {
                nextStatus = 'lost';
            }

            return {
                ...previousState,
                guessedLetters: nextGuessedLetters,
                wrongGuesses: nextWrongGuesses,
                status: nextStatus,
            };
        });
    };

    const handleReset = () => {
        setGameState(createInitialState());
    };

    const revealedWord = gameState.status === 'lost' ? gameState.word : null;
    const statusMessage =
        gameState.status === 'won'
            ? 'You won! Nice work.'
            : gameState.status === 'lost'
                ? `Game over! The word was ${gameState.word}.`
                : 'Pick a letter to keep going.';

    return (
        <HangmanUI
            word={gameState.word}
            guessedLetters={gameState.guessedLetters}
            wrongGuesses={gameState.wrongGuesses}
            maxWrongGuesses={config.maxWrongGuesses}
            failedWord={config.failedWord}
            status={gameState.status}
            statusMessage={statusMessage}
            onGuess={handleGuess}
            onReset={handleReset}
            revealedWord={revealedWord}
            totalUniqueLetters={uniqueLetters.size}
        />
    );
}