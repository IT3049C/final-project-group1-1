import { Square } from "./Square";

export function Board({ squares, status, onSquareClick, disabled = false }) {
  const rows = [0, 3, 6];

  return (
    <>
      <div className="status">{status}</div>
      {rows.map((startIndex) => (
        <div className="board-row" key={startIndex}>
          {squares.slice(startIndex, startIndex + 3).map((value, offset) => {
            const squareIndex = startIndex + offset;

            return (
              <Square
                key={squareIndex}
                value={value}
                disabled={disabled || Boolean(value)}
                onSquareClick={() => onSquareClick(squareIndex)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}