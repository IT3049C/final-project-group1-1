export function BattleshipTile({ 
  tile, 
  row, 
  col, 
  selectedShip, 
  isValidStart,
  onTileClick,
  placedShips 
}){
  // Check if this tile is part of a placed ship
  const isPlaced = Object.values(placedShips).some(placedShip =>
    placedShip.placed && placedShip.positions.some(pos => pos.row === row && pos.col === col)
  );

  let className = 'battleship-tile';
  if (isPlaced) {
    className += ' placed-ship';
  } else if (selectedShip) {
    className += isValidStart ? ' potential-valid' : ' potential-invalid';
  }

  const handleClick = () => {
    onTileClick(row, col);
    console.log(placedShips);
  };

  return(
    <button 
      key={tile.key} 
      id={tile.id} 
      className={className}
      onClick={handleClick}
    >
      {isPlaced ? '🚢' : '🌊'}
    </button>
  );
}