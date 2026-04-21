import { PlayerInfoCard } from "../components/PlayerInfoCard";
import { WordleMain } from "../components/wordle-game/WordleMain";
import { loadSettings } from "../logic/settings";

export function WordleGamePage(){
    const settings = loadSettings();
    const playerName = settings?.name || 'Player';
    const playerAvatar = settings?.avatar;
    return (
        <>
        <h2>Wordle Game</h2>
        <PlayerInfoCard playerName={playerName} playerAvatar={playerAvatar} />

        <WordleMain />

        </>
    )
}