import { PlayerInfoCard } from "../components/rps-game/PlayerInfoCard";
import { HangmanUI } from "../components/hangman-game/HangmanUI";
import { loadSettings } from "../logic/settings";

export function HangmanGamePage(){
    const settings = loadSettings();
    const playerName = settings?.name || 'Player';
    const playerAvatar = settings?.avatar;
    return (
        <>
        <h2>Hangman</h2>
        <PlayerInfoCard playerName={playerName} playerAvatar={playerAvatar} />

        <HangmanUI />

        </>
    )
}