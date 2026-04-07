import { useState } from "react";

export function WordleMain(){
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState("");

    const handleInputChange = (e) => {
        setCurrentGuess(e.target.value);
    }
    

}