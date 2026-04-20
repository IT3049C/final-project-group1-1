import { useEffect, useState } from 'react';
import { BattleshipTile } from './BattleshipTile';
import { ShipSelector } from './ShipSelector';

// Ship definitions
const SHIPS = {
  carrier: { name: 'Carrier', size: 5 },
  battleship: { name: 'Battleship', size: 4 },
  cruiser: { name: 'Cruiser', size: 3 },
  submarine: { name: 'Submarine', size: 3 },
  destroyer: { name: 'Destroyer', size: 2 }
};

export function BattleshipBoard(){
  const BATTLESHIP_GRID_SIZE = 10;
  const [grid, setGrid] = useState([]);
  const [placementPhase, setPlacementPhase] = useState(true);
  const [shipsPlacement, setShipsPlacement] = useState([]);
  const [selectedShip, setSelectedShip] = useState();
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [placedShips, setPlacedShips] = useState({
    carrier: { placed: false, positions: [] },
    battleship: { placed: false, positions: [] },
    cruiser: { placed: false, positions: [] },
    submarine: { placed: false, positions: [] },
    destroyer: { placed: false, positions: [] }
  });

  // Validate if a ship can be placed at the given position
  const validatePlacement = (startRow, startCol, shipKey, horizontal) => {
    const ship = SHIPS[shipKey.toLowerCase()];
    if (!ship) return { valid: false, positions: [] };

    const positions = [];
    const size = ship.size;

    for (let i = 0; i < size; i++) {
      const row = horizontal ? startRow : startRow + i;
      const col = horizontal ? startCol + i : startCol;

      // Check bounds
      if (row < 0 || row >= BATTLESHIP_GRID_SIZE || col < 0 || col >= BATTLESHIP_GRID_SIZE) {
        return { valid: false, positions: [] };
      }

      // Check if tile is already occupied
      const occupied = Object.values(placedShips).some(placedShip =>
        placedShip.placed && placedShip.positions.some(pos => pos.row === row && pos.col === col)
      );
      if (occupied) {
        return { valid: false, positions: [] };
      }

      positions.push({ row, col });
    }

    return { valid: true, positions };
  };

  // Handle tile click for placement
  const handleTileClick = (row, col) => {
    if (!selectedShip) return;

    const validation = validatePlacement(row, col, selectedShip, isHorizontal);
    if (!validation.valid) return;

    // Place the ship
    setPlacedShips(prev => ({
      ...prev,
      [selectedShip.toLowerCase()]: {
        placed: true,
        positions: validation.positions
      }
    }));

    // Clear selection
    setSelectedShip(null);
  };

  useEffect(() => {
    const newGrid = [];
    for(let i = 0; i < BATTLESHIP_GRID_SIZE; i++){
      newGrid.push([]);
    }
    let tileCount = 0;

    for(let row = 0; row < BATTLESHIP_GRID_SIZE; row++){
      for(let col = 0; col < BATTLESHIP_GRID_SIZE; col++){
        newGrid[row][col] = {key: tileCount, 
        id: `row:${row}-col:${col}`, 
        isEmpty: true,
        isHit: false};
        tileCount++;
      }
    }
    setGrid(newGrid);
  }, []);

  return(
    <div id="battleship-game">
      {placementPhase && 
      (<ShipSelector 
        setSelectedShip={setSelectedShip}
        setIsHorizontal={setIsHorizontal}
      />)}

      <div id="battleship-grid">
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="battleship-row">
            {row.map((tile, colIndex) => {
              const isValidStart = selectedShip ? validatePlacement(rowIndex, colIndex, selectedShip, isHorizontal).valid : false;
              return (
                <BattleshipTile 
                  key={tile.key}
                  tile={tile}
                  row={rowIndex}
                  col={colIndex}
                  selectedShip={selectedShip}
                  isValidStart={isValidStart}
                  onTileClick={handleTileClick}
                  placedShips={placedShips}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}