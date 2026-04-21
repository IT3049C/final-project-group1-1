import { describe, expect, test } from "vitest";
import {
    addPlayerToRoomState,
    buildNextGameState,
    calculateWinner,
    createInitialTicTacToeState,
    getPlayerForMark,
    getPlayerMark,
} from "../ticTacToe";

describe("tic-tac-toe room helpers", () => {
    test("creates a room state for the creator", () => {
        const state = createInitialTicTacToeState("Alice");

        expect(state.players).toEqual(["Alice"]);
        expect(state.turn).toBe("Alice");
        expect(state.board).toHaveLength(9);
        expect(state.winner).toBeNull();
        expect(state.version).toBe(0);
    });

    test("adds a second player to an open room", () => {
        const state = addPlayerToRoomState(createInitialTicTacToeState("Alice"), "Bob");

        expect(state.players).toEqual(["Alice", "Bob"]);
        expect(state.turn).toBe("Alice");
        expect(state.version).toBe(1);
    });
});

describe("tic-tac-toe game logic", () => {
    test("calculates a winner from a completed row", () => {
        expect(calculateWinner(["X", "X", "X", null, null, null, null, null, null])).toBe("X");
    });

    test("maps player names to marks", () => {
        const state = { players: ["Alice", "Bob"] };

        expect(getPlayerMark(state, "Alice")).toBe("X");
        expect(getPlayerMark(state, "Bob")).toBe("O");
        expect(getPlayerForMark(state, "X")).toBe("Alice");
        expect(getPlayerForMark(state, "O")).toBe("Bob");
    });

    test("builds the next state after a valid move", () => {
        const nextState = buildNextGameState(
        {
            players: ["Alice", "Bob"],
            turn: "Alice",
            board: Array(9).fill(null),
            winner: null,
            version: 2,
        },
        "Alice",
        0,
        );

        expect(nextState.board[0]).toBe("X");
        expect(nextState.turn).toBe("Bob");
        expect(nextState.winner).toBeNull();
        expect(nextState.version).toBe(3);
    });
});