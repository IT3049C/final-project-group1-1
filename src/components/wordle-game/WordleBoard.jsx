import { useCallback, useEffect, useMemo, useState } from 'react';
import { checkGuess, config, normalizeGuess } from './WordleGameHandler';

const EMPTY_RESULTS = Array(config.maxAttempts).fill(null);
const EMPTY_GUESSES = Array(config.maxAttempts).fill('');

function isLetter(value) {
    return value.length === 1 && /^[A-Z]$/.test(value);
}

export function WordleBoard({ targetWord, onRestart }) {
    const [guesses, setGuesses] = useState(EMPTY_GUESSES);
    const [resultsByRow, setResultsByRow] = useState(EMPTY_RESULTS);
    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [statusMessage, setStatusMessage] = useState('Type a 5-letter guess and press Enter.');
    const [isComplete, setIsComplete] = useState(false);
    const [flippingRow, setFlippingRow] = useState(null);

    const target = useMemo(() => normalizeGuess(targetWord), [targetWord]);
    const isFlipping = flippingRow !== null;

    const flipDurationMs = 420;
    const flipStaggerMs = 130;
    const totalFlipDurationMs = flipDurationMs + flipStaggerMs * (config.wordLength - 1);

    useEffect(() => {
        setGuesses(EMPTY_GUESSES);
        setResultsByRow(EMPTY_RESULTS);
        setCurrentAttempt(0);
        setCurrentGuess('');
        setStatusMessage('Type a 5-letter word and press Enter.');
        setIsComplete(false);
        setFlippingRow(null);
    }, [target]);

    const submitGuess = useCallback(() => {
        if (isComplete || isFlipping) {
            return;
        }

        if (currentGuess.length !== config.wordLength) {
            setStatusMessage('Your guess must be 5 letters long.');
            return;
        }

        const result = checkGuess(currentGuess, target);
        if (!result) {
            setStatusMessage('Please enter a valid guess.');
            return;
        }

        const normalizedGuess = normalizeGuess(currentGuess);
        setFlippingRow(currentAttempt);

        window.setTimeout(() => {
            setFlippingRow(null);
        }, totalFlipDurationMs);

        setGuesses((previous) => {
            const next = [...previous];
            next[currentAttempt] = normalizedGuess;
            return next;
        });

        setResultsByRow((previous) => {
            const next = [...previous];
            next[currentAttempt] = result;
            return next;
        });

        const isWin = result.every((entry) => entry === 'correct');
        const lastAttempt = currentAttempt >= config.maxAttempts - 1;

        if (isWin) {
            setStatusMessage(`You win 🎉! The word was ${target}.`);
            setIsComplete(true);
            return;
        }

        if (lastAttempt) {
            setStatusMessage(`Game over 🙁. The word was ${target}.`);
            setIsComplete(true);
            return;
        }

        setCurrentAttempt((value) => value + 1);
        setCurrentGuess('');
        setStatusMessage('Keep going.');
    }, [currentAttempt, currentGuess, isComplete, isFlipping, target, totalFlipDurationMs]);

    useEffect(() => {
        function onKeyDown(event) {
            if (isComplete || isFlipping) {
                return;
            }

            if (event.key === 'Backspace') {
                setCurrentGuess((value) => value.slice(0, -1));
                return;
            }

            if (event.key === 'Enter') {
                submitGuess();
                return;
            }

            const key = event.key.toUpperCase();
            if (!isLetter(key)) {
                return;
            }

            setCurrentGuess((value) => {
                if (value.length >= config.wordLength) {
                    return value;
                }

                return `${value}${key}`;
            });
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isComplete, isFlipping, submitGuess]);

    return (
        <section className="wordle-section card" aria-label="Wordle game board">
            <div className="wordle-board" role="grid" aria-label="Wordle board">
                {Array.from({ length: config.maxAttempts }, (_, rowIndex) => {
                    const rowGuess =
                        rowIndex < currentAttempt
                            ? guesses[rowIndex]
                            : rowIndex === currentAttempt
                                ? currentGuess
                                : '';

                    const rowResult = resultsByRow[rowIndex] || [];

                    return Array.from({ length: config.wordLength }, (_, colIndex) => {
                        const letter = rowGuess[colIndex] || '';
                        const stateClass = rowResult[colIndex] || '';
                        const isCellFlipping = flippingRow === rowIndex && !!stateClass;

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`wordle-cell ${stateClass} ${isCellFlipping ? 'is-flipping' : ''}`.trim()}
                                style={isCellFlipping ? { '--flip-delay': `${colIndex * flipStaggerMs}ms` } : undefined}
                                role="gridcell"
                                aria-label={`Row ${rowIndex + 1} column ${colIndex + 1}: ${letter || 'empty'}`}
                            >
                                {letter}
                            </div>
                        );
                    });
                })}
            </div>

            <p className="wordle-status" aria-live="polite">
                {statusMessage}
            </p>

            <div className="buttons">
                <button type="button" onClick={submitGuess} disabled={isComplete || isFlipping}>
                    Submit Guess
                </button>
                <button type="button" onClick={onRestart}>
                    New Word
                </button>
            </div>
        </section>
    );
}
