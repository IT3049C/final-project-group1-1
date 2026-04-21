import { useEffect, useMemo, useState } from "react";
import { Board } from "../components/tic-tac-toe-game/Board";
import { loadSettings } from "../logic/settings";
import {
  addPlayerToRoomState,
  buildNextGameState,
  createInitialTicTacToeState,
  getPlayerForMark,
  getPlayerMark,
} from "../logic/ticTacToe";
import { createRoom, readRoom, updateRoom } from "../logic/ticTacToeRoom";

export function TicTacToePage() {
  const settings = loadSettings();
  const playerName = settings?.name?.trim() || "Player";

  const [roomId, setRoomId] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [gameState, setGameState] = useState(null);
  const [message, setMessage] = useState("Create a room or join an existing room to begin.");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentMark = useMemo(() => getPlayerMark(gameState, playerName), [gameState, playerName]);

  const status = useMemo(() => {
    if (!gameState) {
      return message;
    }

    if (gameState.winner === "tie") {
      return "The game ended in a tie.";
    }

    if (gameState.winner) {
      const winnerName = getPlayerForMark(gameState, gameState.winner);
      return winnerName ? `${winnerName} won as ${gameState.winner}.` : `Winner: ${gameState.winner}`;
    }

    if (gameState.players.length < 2) {
      return `Room ${roomId} is waiting for a second player.`;
    }

    if (gameState.turn === playerName) {
      return `Your turn as ${currentMark}.`;
    }

    return `Waiting for ${gameState.turn} to move.`;
  }, [currentMark, gameState, message, playerName, roomId]);

  useEffect(() => {
    if (!roomId) {
      return undefined;
    }

    let isActive = true;

    const syncRoom = async () => {
      try {
        const room = await readRoom(roomId);

        if (!isActive) {
          return;
        }

        setGameState(room.gameState);
        setError("");
      } catch (syncError) {
        if (isActive) {
          setError(syncError.message || "Unable to sync the room state.");
        }
      }
    };

    syncRoom();
    const intervalId = window.setInterval(syncRoom, 2500);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [roomId]);

  async function handleCreateRoom() {
    setIsLoading(true);
    setError("");

    try {
      const response = await createRoom(createInitialTicTacToeState(playerName));
      setRoomId(response.roomId);
      setRoomInput(response.roomId);
      setGameState(response.gameState);
      setMessage(`Created room ${response.roomId}. Share the room ID with the second player.`);
    } catch (createError) {
      setError(createError.message || "Unable to create a room.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleJoinRoom(event) {
    event.preventDefault();

    const normalizedRoomId = roomInput.trim().toUpperCase();

    if (!normalizedRoomId) {
      setError("Enter a room ID to join.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const room = await readRoom(normalizedRoomId);
      let nextGameState = room.gameState;

      if (!nextGameState.players.includes(playerName)) {
        nextGameState = addPlayerToRoomState(nextGameState, playerName);
        const updatedRoom = await updateRoom(normalizedRoomId, nextGameState);
        nextGameState = updatedRoom.gameState || nextGameState;
      }

      setRoomId(normalizedRoomId);
      setGameState(nextGameState);
      setMessage(`Joined room ${normalizedRoomId}.`);
    } catch (joinError) {
      setError(joinError.message || "Unable to join the room.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSquareClick(squareIndex) {
    if (!roomId) {
      setError("Create or join a room first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const room = await readRoom(roomId);
      const nextGameState = buildNextGameState(room.gameState, playerName, squareIndex);
      const updatedRoom = await updateRoom(roomId, nextGameState);
      setGameState(updatedRoom.gameState || nextGameState);
    } catch (playError) {
      setError(playError.message || "Unable to submit that move.");
    } finally {
      setIsLoading(false);
    }
  }

  const canPlay = Boolean(
    gameState &&
      gameState.players.length === 2 &&
      gameState.turn === playerName &&
      !gameState.winner &&
      currentMark,
  );

  const roomPlayers = gameState?.players || [];

  return(
    <section className="card tic-tac-toe-page">
      <header>
        <h2>Tic-Tac-Toe Multiplayer</h2>
      </header>

      <div className="tic-tac-toe-room-panel">
        <p className="room-summary">Signed in as {playerName}.</p>
        <form className="room-controls" onSubmit={handleJoinRoom}>
          <label className="field">
            <span>Room ID</span>
            <input
              value={roomInput}
              onChange={(event) => setRoomInput(event.target.value)}
              placeholder="Enter a room ID"
              autoCapitalize="characters"
            />
          </label>
          <div className="buttons">
            <button type="button" className="btn-primary" onClick={handleCreateRoom} disabled={isLoading}>
              Create Room
            </button>
            <button type="submit" disabled={isLoading}>
              Join Room
            </button>
          </div>
        </form>
        {roomId ? <p className="room-summary">Connected room: {roomId}</p> : null}
        <p className="status-message">{status}</p>
        {error ? <p className="errors">{error}</p> : null}
      </div>

      <div className="game game--multiplayer">
        <div className="game-board">
          <Board
            squares={gameState?.board || Array(9).fill(null)}
            status={status}
            onSquareClick={handleSquareClick}
            disabled={!canPlay || isLoading}
          />
        </div>

        <div className="game-info">
          <p>
            Players: {roomPlayers.length ? roomPlayers.join(" vs ") : "Waiting for a room"}
          </p>
          <p>
            Your mark: {currentMark || "spectator"}
          </p>
          <p>
            Version: {gameState?.version ?? 0}
          </p>
        </div>
      </div>
    </section>
  )
}