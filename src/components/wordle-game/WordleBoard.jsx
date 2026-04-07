import { config,  } from "./WordleGameHandler";


export function WordleBoard(){
    const grid = document.getElementById("wordle-board");

    function setUpGrid() {
        grid.innerHTML = '';
        grid.style.gridTemplateRows = `repeat(${config.maxAttempts}, 1fr)`;
        grid.style.gridTemplateColumns = `repeat(${config.wordLength}, 1fr)`;
        const grid = document.getElementById("wordle-board");
        for (let row = 0; row < config.maxAttempts; row++) {
            for (let col = 0; col < config.wordLength; col++) {
                addLetterToGrid(row, col);
            }
        }
    }

    function addLetterToGrid(row, col) {
        const letter = document.createElement('div');
        letter.classList.add(`letter`);
        letter.id = `letter-r${row}-c${col}`;
        grid.appendChild(letter);
    }
    
    setUpGrid();

    return(
        <div id="wordle-board" className="wordle-board">
        
        </div>

    );
}
