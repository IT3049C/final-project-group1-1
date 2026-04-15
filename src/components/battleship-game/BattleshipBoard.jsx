import { useEffect, useState } from 'react';
import { BattleshipTile } from './BattleshipTile';

export function BattleshipBoard(){
  const BATTLESHIP_GRID_SIZE = 10;
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    const newGrid = [];
    for(let i = 0; i < BATTLESHIP_GRID_SIZE; i++){
      newGrid.push([]);
    }
    let tileCount = 0;

    for(let row = 0; row < BATTLESHIP_GRID_SIZE; row++){
      for(let col = 0; col < BATTLESHIP_GRID_SIZE; col++){
        newGrid[row][col] = {key: tileCount, id: `row:${row}-col:${col}`};
        tileCount++;
      }
    }
    setGrid(newGrid);
    console.log('Grid created');
  }, []);

  return(
    <div id="battleship-grid">
      <div id="row-1">
        {grid[0]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
      <div id="row-2">
        {grid[1]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
      <div id="row-3">
        {grid[2]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
      <div id="row-4">
        {grid[3]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
      <div id="row-5">
        {grid[4]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
      <div id="row-6">
        {grid[5]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
      <div id="row-7">
        {grid[6]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
      <div id="row-8">
        {grid[7]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
      <div id="row-9">
        {grid[8]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
      <div id="row-10">
        {grid[9]?.map((tile) => (
          <BattleshipTile tile={tile}/>
        ))}
      </div>
    </div>
  );
}