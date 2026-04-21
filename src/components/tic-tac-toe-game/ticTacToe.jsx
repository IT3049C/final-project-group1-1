export const BOARD_SIZE = 9;

const WINNING_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function createEmptyBoard() {
    return Array(BOARD_SIZE).fill(null);
}

export function createInitialTicTacToeState(playerName) {
    const normalizedPlayerName = playerName?.trim() || null;

    return {
        players: normalizedPlayerName ? [normalizedPlayerName] : [],
        turn: normalizedPlayerName,
        board: createEmptyBoard(),
        winner: null,
        version: 0,
    };
}

export function calculateWinner(board) {
    for (const [a, b, c] of WINNING_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
    }
}

    return null;
}

export function isBoardFull(board) {
    return board.every((square) => square !== null);
}

export function getPlayerMark(gameState, playerName) {
    const players = gameState?.players || [];
    const index = players.indexOf(playerName);

    if (index === 0) {
        return "X";
    }

    if (index === 1) {
        return "O";
    }

    return null;
}

export function getPlayerForMark(gameState, mark) {
    if (mark === "X") {
        return gameState?.players?.[0] || null;
    }

    if (mark === "O") {
        return gameState?.players?.[1] || null;
    }

    return null;
    }

    export function addPlayerToRoomState(gameState, playerName) {
    const normalizedPlayerName = playerName?.trim();

    if (!normalizedPlayerName) {
        throw new Error("Player name is required to join a room.");
    }

    const players = gameState?.players || [];

    if (players.includes(normalizedPlayerName)) {
        return {
        ...gameState,
        players,
        };
    }

    if (players.length >= 2) {
        throw new Error("That room already has two players.");
    }

    return {
        ...gameState,
        players: [...players, normalizedPlayerName],
        turn: gameState?.turn || normalizedPlayerName,
        version: (gameState?.version || 0) + 1,
    };
}

export function buildNextGameState(gameState, playerName, squareIndex) {
    if (!gameState) {
        throw new Error("Room state is unavailable.");
    }

    if (gameState.winner) {
        throw new Error("This game has already finished.");
    }

    const players = gameState.players || [];
    const currentPlayerIndex = players.indexOf(playerName);

    if (players.length < 2) {
        throw new Error("Waiting for a second player to join.");
    }

    if (currentPlayerIndex === -1) {
        throw new Error("You are not part of this room.");
    }

    if (gameState.turn !== playerName) {
        throw new Error("It is not your turn.");
    }

    if (squareIndex < 0 || squareIndex >= BOARD_SIZE) {
        throw new Error("Invalid move.");
    }

    if (gameState.board[squareIndex]) {
        throw new Error("That square is already occupied.");
    }

    const playerMark = getPlayerMark(gameState, playerName);

    if (!playerMark) {
        throw new Error("Unable to determine your mark for this room.");
    }

    const nextBoard = gameState.board.slice();
    nextBoard[squareIndex] = playerMark;

    const winner = calculateWinner(nextBoard);
    const nextWinner = winner || (isBoardFull(nextBoard) ? "tie" : null);
    const nextTurn = nextWinner ? null : players.find((candidate) => candidate !== playerName) || playerName;

    return {
        ...gameState,
        board: nextBoard,
        turn: nextTurn,
        winner: nextWinner,
        version: (gameState.version || 0) + 1,
    };
}