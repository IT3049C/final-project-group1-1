import { PlayerInfoCard } from "../components/PlayerInfoCard";
import { HangmanHandler } from "../components/hangman-game/HangmanHandler";
import { loadSettings } from "../logic/settings";

export function HangmanGamePage(){
    const settings = loadSettings();
    const playerName = settings?.name || 'Player';
    const playerAvatar = settings?.avatar;
    return (
        <>
        <h2>Hangman</h2>
        <PlayerInfoCard playerName={playerName} playerAvatar={playerAvatar} />

        <HangmanHandler />

        </>
    )
}