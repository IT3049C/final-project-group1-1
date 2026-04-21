export function BattleshipTile({ 
  tile, 
  row, 
  col, 
  selectedShip, 
  isValidStart,
  onTileClick,
  placedShips,
  attacked,
  isEnemy
}){
  // Check if this tile is part of a placed ship
  const isPlaced = Object.values(placedShips).some(placedShip =>
    placedShip.placed && placedShip.positions.some(pos => pos.row === row && pos.col === col)
  );

  const attackedTile = attacked.find(a => a.row === row && a.col === col);

  let display = '🌊';
  let className = 'battleship-tile';

  if (isEnemy) {
    if (attackedTile) {
      display = attackedTile.hit ? '💥' : '❌';
      className += attackedTile.hit ? ' hit' : ' miss';
    }
  } else {
    if (isPlaced) {
      if (attackedTile && attackedTile.hit) {
        display = '💥';
        className += ' hit';
      } else {
        display = '🚢';
        className += ' placed-ship';
      }
    } else if (attackedTile) {
      display = attackedTile.hit ? '💥' : '❌';
      className += attackedTile.hit ? ' hit' : ' miss';
    }
  }

  if (selectedShip) {
    className += isValidStart ? ' potential-valid' : ' potential-invalid';
  }

  const handleClick = () => {
    if (isEnemy && attackedTile) return;
    onTileClick(row, col);
  };

  return(
    <button 
      key={tile.key} 
      id={tile.id} 
      className={className}
      onClick={handleClick}
    >
      {display}
    </button>
  );
}