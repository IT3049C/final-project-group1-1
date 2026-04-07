export function WordleBoard({guesses, currentGuess, onInputChange}){
    return(
    <div className="wordle-board">
        {guesses.map((guess, index) => (
            <div key={index} className="guess-row">
                {guess.split("").map((letter, letterIndex) => (
                    <div key={letterIndex} className="guess-letter">
                        {letter}
                    </div>
                ))}
            </div>
        ))}
        <div className="current-guess-row">
            <input 
                type="text" 
                maxLength="5" 
                className="current-guess-input" 
                value={currentGuess} 
                onChange={onInputChange} 
            />
        </div>
    </div>
    );
}
