export function BattleshipTile({ tile }){
  return(
    <button key={tile.key} id={tile.id} className='battleship-tile'>X</button>
  )
}