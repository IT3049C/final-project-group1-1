import { BattleshipBoard } from "../components/battleship-game/BattleshipBoard";
import { PlayerInfoCard } from "../components/PlayerInfoCard";
import { loadSettings } from "../logic/settings";

export function BattleshipPage(){
  const settings = loadSettings();
  const playerName = settings?.name || 'Player';
  const playerAvatar = settings?.avatar;

  return(
    <div className="game">
      <header>
        <h2>Battleship</h2>
      </header>
      <PlayerInfoCard playerName={playerName} playerAvatar={playerAvatar}/>
      <BattleshipBoard />
    </div>
  );
}