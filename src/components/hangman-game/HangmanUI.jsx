export function HangmanUI({ word, guessedLetters, onGuess, statusMessage }) {
    const displayWord = word
        .split('')
        .map((char) => (guessedLetters.includes(char) ? char : '_'))
        .join(' ');

    return (
        <div className="hangman-ui">
            <p className="hangman-word" aria-live="polite">
                {displayWord}
            </p>
            <p className="hangman-status" aria-live="polite">
                {statusMessage}
            </p>
            <div className="hangman-controls">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                    <button
                        key={letter}
                        type="button"
                        onClick={() => onGuess(letter)}
                        disabled={guessedLetters.includes(letter)}
                        aria-label={`Guess letter ${letter}`}
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </div>
    );
}