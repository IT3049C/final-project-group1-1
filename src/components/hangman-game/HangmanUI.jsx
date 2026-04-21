const HANGMAN_STAGE_IMAGES = [
    'REPLACE_WITH_HANGMAN_STAGE_0_IMAGE',
    'REPLACE_WITH_HANGMAN_STAGE_1_IMAGE',
    'REPLACE_WITH_HANGMAN_STAGE_2_IMAGE',
    'REPLACE_WITH_HANGMAN_STAGE_3_IMAGE',
    'REPLACE_WITH_HANGMAN_STAGE_4_IMAGE',
    'REPLACE_WITH_HANGMAN_STAGE_5_IMAGE',
    'REPLACE_WITH_HANGMAN_STAGE_6_IMAGE',
    'REPLACE_WITH_HANGMAN_STAGE_7_IMAGE',
];

export function HangmanUI({
    word,
    guessedLetters,
    wrongGuesses,
    maxWrongGuesses,
    failedWord,
    status,
    statusMessage,
    onGuess,
    onReset,
    revealedWord,
    totalUniqueLetters,
}) {
    const displayWord = word
        .split('')
        .map((char) => (guessedLetters.includes(char) ? char : '_'))
        .join(' ');

    const guessedWordProgress = `${guessedLetters.filter((letter) => word.includes(letter)).length}/${totalUniqueLetters}`;
    const failedAttemptText = failedWord.slice(0, wrongGuesses).split('').join(' ');
    const isGameOver = status === 'won' || status === 'lost';
    const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

    return (
        <div className="hangman-ui">
            <h3>Guess The Word</h3>

            <p className="hangman-word" aria-live="polite">
                {displayWord}
            </p>

            {revealedWord ? <p>The full word: {revealedWord}</p> : null}

            <p className="hangman-status" aria-live="polite">
                {statusMessage}
            </p>

            <p aria-live="polite">Failed attempts (HANGMAN): {failedAttemptText || 'None'}</p>
            <p aria-live="polite">
                Wrong guesses: {wrongGuesses}/{maxWrongGuesses}
            </p>
            <p aria-live="polite">Correct letters found: {guessedWordProgress}</p>

            <div className="hangman-controls" role="group" aria-label="Letter keyboard">
                {keyboardRows.map((row, rowIndex) => (
                    <div key={row} className={`hangman-keyboard-row hangman-keyboard-row-${rowIndex + 1}`}>
                        {row.split('').map((letter) => {
                            const wasGuessed = guessedLetters.includes(letter);
                            const isCorrectLetter = wasGuessed && word.includes(letter);

                            return (
                                <button
                                    key={letter}
                                    type="button"
                                    className={isCorrectLetter ? 'hangman ui correct' : 'hangman ui'}
                                    onClick={() => onGuess(letter)}
                                    disabled={wasGuessed || isGameOver}
                                    aria-label={`Guess letter ${letter}`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <button type="button" onClick={onReset}>
                New Word
            </button>
        </div>
    );
}