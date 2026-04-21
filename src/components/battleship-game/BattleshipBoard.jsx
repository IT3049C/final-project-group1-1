import { useState } from 'react';
import { BattleshipGrid } from './BattleshipGrid';
import { ShipSelector } from './ShipSelector';

// Ship definitions
const SHIPS = {
  carrier: { name: 'Carrier', size: 5 },
  battleship: { name: 'Battleship', size: 4 },
  cruiser: { name: 'Cruiser', size: 3 },
  submarine: { name: 'Submarine', size: 3 },
  destroyer: { name: 'Destroyer', size: 2 }
};
const BASE = 'https://game-room-api.fly.dev'

export function BattleshipBoard({ playerName }){
  const BATTLESHIP_GRID_SIZE = 10;
  const [placementPhase, setPlacementPhase] = useState(true);
  const [connectPhase, setConnectPhase] = useState(false);
  const [selectedShip, setSelectedShip] = useState();
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [placedShips, setPlacedShips] = useState({
    carrier: { placed: false, positions: [] },
    battleship: { placed: false, positions: [] },
    cruiser: { placed: false, positions: [] },
    submarine: { placed: false, positions: [] },
    destroyer: { placed: false, positions: [] }
  });
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [gameState, setGameState] = useState({
    players: [],
    boards: {
      p1: {shipsPosition: [], hits: [], misses: []},
      p2: {shipsPosition: [], hits: [], misses: []}
    },
    turn: null,
    winner: null,
    version: 0
  })

  // Validate if a ship can be placed at the given position
  function validatePlacement(startRow, startCol, shipKey, horizontal, ignoreShipKey = null){
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

      // Check if tile is already occupied by a different ship
      const occupied = Object.entries(placedShips).some(([placedShipKey, placedShip]) =>
        placedShip.placed && placedShipKey !== ignoreShipKey && placedShip.positions.some(pos => pos.row === row && pos.col === col)
      );
      if (occupied) {
        return { valid: false, positions: [] };
      }

      positions.push({ row, col });
    }

    return { valid: true, positions };
  };

  function handleTileClick(row, col){
    if (!selectedShip) return;

    const validation = validatePlacement(row, col, selectedShip, isHorizontal, selectedShip.toLowerCase());
    if (!validation.valid) return;

    setPlacedShips(prev => ({
      ...prev,
      [selectedShip.toLowerCase()]: {
        placed: true,
        positions: validation.positions
      }
    }));

    setSelectedShip(null);
  };

  function onReady(){
    setPlacementPhase(false);
    setConnectPhase(true);
  }

  function handleSubmit(e){
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
  }

  async function handleCreateRoom(){
    const { roomId } = await apiCreateRoom(gameState);
    setCreatedRoomId(roomId);
    console.log(`${BASE}/api/rooms`);
    setConnectPhase(false);
  }

  async function apiCreateRoom(initialState){
    const res = await fetch(`${BASE}/api/rooms`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initialState })
    });
    if(!res.ok) throw new Error('Failed to create room');
    return res.json();
  }

  return(
    <div id="battleship-game">
      {createdRoomId && 
      <div id='game-room-display'>
        <h2>Game Room Code:</h2>
        <h1>{createdRoomId}</h1>
      </div>}
      {placementPhase && 
      (<ShipSelector 
        setSelectedShip={setSelectedShip}
        setIsHorizontal={setIsHorizontal}
      />)}

      {!connectPhase && (
        <BattleshipGrid
          gridSize={BATTLESHIP_GRID_SIZE}
          selectedShip={selectedShip}
          isHorizontal={isHorizontal}
          placedShips={placedShips}
          validatePlacement={validatePlacement}
          onTileClick={handleTileClick}
        />
      )}

      {placementPhase && Object.values(placedShips).every(ship => ship.placed) && (
        <button
          id="start-game-btn"
          onClick={() => onReady()}
        >
          Ready For Battle!
        </button>
      )}
      {connectPhase && 
      <div id='connect-to-game-room'>
        <form onSubmit={handleSubmit}>
          <div className='field'>
            <label htmlFor='room-code'>Input a room code: </label>
            <input id='room-code' type='text' placeholder='ABC123' name='room-code'/>
          </div>
          <button id='create-game-room' type='button' onClick={handleCreateRoom}>Create Game Room</button>
          <button type='submit'>Join Game Room</button>
        </form>
      </div>}
    </div>
  );
}