import { useState } from "react";

export function WordleMain(){
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState("");

    const handleInputChange = (e) => {
        setCurrentGuess(e.target.value);
    }
    return(<>
    <div className="wordle-main">
        <h3>Wordle Game</h3>
        <p>Guess the 5-letter word!</p>
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
                    onChange={handleInputChange} 
                />
            </div>
        </div>
    </div>

    </>
    );


}

