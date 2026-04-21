import { useState } from 'react';
import { BattleshipGrid } from './BattleshipGrid';
import { ShipSelector } from './ShipSelector';
import { useGameRoom } from './battleshipApi';

// Ship definitions
const SHIPS = {
  carrier: { name: 'Carrier', size: 5 },
  battleship: { name: 'Battleship', size: 4 },
  cruiser: { name: 'Cruiser', size: 3 },
  submarine: { name: 'Submarine', size: 3 },
  destroyer: { name: 'Destroyer', size: 2 }
};

export function BattleshipBoard({ playerName }){
  const BATTLESHIP_GRID_SIZE = 10;
  const [placementPhase, setPlacementPhase] = useState(true);
  const [connectPhase, setConnectPhase] = useState(false);
  const [selectedShip, setSelectedShip] = useState();
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [winner, setWinner] = useState(null);
  const [placedShips, setPlacedShips] = useState({
    carrier: { placed: false, positions: [] },
    battleship: { placed: false, positions: [] },
    cruiser: { placed: false, positions: [] },
    submarine: { placed: false, positions: [] },
    destroyer: { placed: false, positions: [] }
  });
  const defaultState = {
    players: [{id: 'A', name: `${playerName}`, ready: true}, {id: 'B', name: '', ready: false}],
    boards: {
      p1: {shipsPosition: placedShips, attacked: [], hits: 0, misses: 0},
      p2: {shipsPosition: {}, attacked: [], hits: 0, misses: 0}
    },
    turn: 'A',
    winner: null,
    version: 0,
    updatedBy: playerName
  }
  const { roomId, state, createRoom, pushState, setRoomId } = useGameRoom({ refetchInterval: 200 });

  const currentPlayer = state?.players?.[0]?.name === playerName ? 'A' : 'B';
  const myBoard = currentPlayer === 'A' ? 'p1' : 'p2';
  const enemy = currentPlayer === 'A' ? 'p2' : 'p1';

  function validatePlacement(startRow, startCol, shipKey, horizontal, ignoreShipKey = null){
    const ship = SHIPS[shipKey.toLowerCase()];
    if (!ship) return { valid: false, positions: [] };

    const positions = [];
    const size = ship.size;

    for (let i = 0; i < size; i++) {
      const row = horizontal ? startRow : startRow + i;
      const col = horizontal ? startCol + i : startCol;

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
      // if (roomId && state) {
      //   pushState({ ...state, boards: { ...state.boards, [myBoard]: { ...state.boards[myBoard], shipsPosition: placedShips } }, turn: 'A' });
      // }
  }

  function handleSubmit(e){
    e.preventDefault();
    // roomId is set from input
    if (roomId && state) {
      pushState({ ...state, players: [state.players[0], {id: 'B', name: playerName, ready: true}], boards: { ...state.boards, [myBoard]: { ...state.boards[myBoard], shipsPosition: placedShips } } });
    }
    setConnectPhase(false);
  }

  function handleAttack(row, col){
    if (!roomId || !state || state.players[1].ready === false || state.turn !== currentPlayer) return;
    const alreadyAttacked = state.boards[myBoard].attacked.some(a => a.row === row && a.col === col);
    if (alreadyAttacked) return;
    if (state?.boards?.[myBoard]?.hits === 17) {
    handleWin();
    return;
    }
    const enemyShips = state.boards[enemy].shipsPosition;
    const isHit = Object.values(enemyShips).some(ship => ship.placed && ship.positions.some(pos => pos.row === row && pos.col === col));
    const newAttacked = [...state.boards[myBoard].attacked, {row, col, hit: isHit}];
    const newHits = state.boards[myBoard].hits + (isHit ? 1 : 0);
    const newMisses = state.boards[myBoard].misses + (isHit ? 0 : 1);
    const newTurn = isHit ? currentPlayer : currentPlayer === 'A' ? 'B' : 'A';
    const newState = {
      ...state,
      boards: {
        ...state.boards,
        [myBoard]: {
          ...state.boards[myBoard],
          attacked: newAttacked,
          hits: newHits,
          misses: newMisses
        }
      },
      turn: newTurn
    };
    pushState(newState);
  }

  function handleWin(){
    setWinner(state?.players?.find(p => p.id === currentPlayer)?.name);
    return;
  }

  const allShipsPlaced = Object.values(placedShips).every(ship => ship.placed);

  async function handleCreateRoom(){
    await createRoom(defaultState);
    setConnectPhase(false);
  }

  return(
    <div id="battleship-game">
      {roomId && 
      <div id='game-room-display'>
        <h3>Game Room Code:</h3>
        <h2>{roomId}</h2>
        <h3>{state?.turn === currentPlayer ? `${playerName}'s Turn!` : `${state?.players?.find(p => p.id !== currentPlayer)?.name || 'Opponent'}'s Turn!`}</h3>
        {winner && (<h1>{`Congratulations ${winner}! You WIN!`}</h1>)}
      </div>}
      {!connectPhase && (
        <div id="battleship-layout">
          {placementPhase && (
            <aside id="battleship-selector-panel">
              <ShipSelector
                setSelectedShip={setSelectedShip}
                setIsHorizontal={setIsHorizontal}
              />
              {allShipsPlaced && (
                <button
                  id="start-game-btn"
                  onClick={onReady}
                >
                  Ready For Battle!
                </button>
              )}
            </aside>
          )}

          <div id="battleship-boards-container">
            <div className="battleship-grid-panel">
              <h3>Player Board</h3>
              <BattleshipGrid
                gridSize={BATTLESHIP_GRID_SIZE}
                selectedShip={selectedShip}
                isHorizontal={isHorizontal}
                placedShips={placedShips}
                validatePlacement={validatePlacement}
                onTileClick={handleTileClick}
                attacked={state?.boards?.[enemy]?.attacked || []}
                isEnemy={false}
              />
            </div>
            {roomId && (
              <div className="battleship-grid-panel">
                <h3>Enemy Board</h3>
                <BattleshipGrid
                  gridSize={BATTLESHIP_GRID_SIZE}
                  selectedShip={null}
                  isHorizontal={true}
                  placedShips={{}}
                  validatePlacement={() => ({ valid: false, positions: [] })}
                  onTileClick={handleAttack}
                  attacked={state?.boards?.[myBoard]?.attacked || []}
                  isEnemy={true}
                />
              </div>
            )}
          </div>
          <div id="battleship-stats-panel">
            <div className="stats-card">
              <span className="stats-label">Hits</span>
              <span className="stats-value">{state?.boards?.[myBoard]?.hits || 0}</span>
            </div>
            <div className="stats-card">
              <span className="stats-label">Misses</span>
              <span className="stats-value">{state?.boards?.[myBoard]?.misses || 0}</span>
            </div>
          </div>
        </div>
      )}
      {connectPhase && 
      <div id='connect-to-game-room'>
        <form onSubmit={handleSubmit}>
          <div className='field'>
            <label htmlFor='room-code'>Input a room code: 
              <input aria-label="Room code" placeholder="Room Code" onChange={e => setRoomId(e.target.value.trim() || null)} />
            </label>
          </div>
          <button id='create-game-room' type='button' onClick={handleCreateRoom}>Create Game Room</button>
          <button type='submit'>Join Game Room</button>
        </form>
      </div>}
    </div>
  );
}