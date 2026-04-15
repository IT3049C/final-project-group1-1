import { useState } from "react";
import { Board } from "../components/tic-tac-toe-game/Board";
import { PlayerInfoCard } from "../components/PlayerInfoCard";
import { loadSettings } from "../logic/settings";

export function TicTacToePage() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const settings = loadSettings();
  const playerName = settings?.name || 'Player';
  const playerAvatar = settings?.avatar;

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return(
    <div className="game">
      <header>
        <h2>Tic-Tac-Toe</h2>
      </header>
      <PlayerInfoCard playerName={playerName} playerAvatar={playerAvatar}/>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          {moves}
        </ol>
      </div>
    </div>
  )
}