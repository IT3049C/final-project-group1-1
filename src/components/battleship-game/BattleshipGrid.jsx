import { useMemo } from 'react';
import { BattleshipTile } from './BattleshipTile';

export function BattleshipGrid({
  gridSize,
  selectedShip,
  isHorizontal,
  placedShips,
  validatePlacement,
  onTileClick,
  attacked,
  isEnemy
}) {
  const grid = useMemo(() => {
    const rows = [];

    for (let row = 0; row < gridSize; row += 1) {
      const rowTiles = [];
      for (let col = 0; col < gridSize; col += 1) {
        rowTiles.push({
          key: row * gridSize + col,
          id: `row:${row}-col:${col}`
        });
      }
      rows.push(rowTiles);
    }

    return rows;
  }, [gridSize]);

  return (
    <div className="battleship-grid">
      {grid.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="battleship-row">
          {row.map((tile, colIndex) => {
            const isValidStart = selectedShip
              ? validatePlacement(
                  rowIndex,
                  colIndex,
                  selectedShip,
                  isHorizontal,
                  selectedShip.toLowerCase()
                ).valid
              : false;

            return (
              <BattleshipTile
                key={tile.key}
                tile={tile}
                row={rowIndex}
                col={colIndex}
                selectedShip={selectedShip}
                isValidStart={isValidStart}
                onTileClick={onTileClick}
                placedShips={placedShips}
                attacked={attacked}
                isEnemy={isEnemy}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
