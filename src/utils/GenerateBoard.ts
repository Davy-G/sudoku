import { ActionHistory, GameState } from "@/types";
import { validateGameState } from "@/utils/game-state.ts";
import seedrandom from "seedrandom";

enum Difficulty {
    EASY = 3,
    MEDIUM = 9,
    HARD = 27,
}

const DiffConst = 81;

const randomHexString = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 16).toString(16);
    }
    return result;
}

const rng = seedrandom(randomHexString(5));

const EMPTY_GAME_STATE: GameState = Array.from({ length: 9 }, () => Array(9).fill(null));


export function GenerateBoard(difficulty: Difficulty): {gameState: GameState, actionHistory: ActionHistory} {
    let gameState = EMPTY_GAME_STATE.map(row => [...row]);
    let actionHistory: ActionHistory = [];
    let fill = Math.floor(DiffConst / difficulty);

    for (let i = 0; i < fill; i++) {
        while (true) {
            let prevState = gameState.map(row => [...row]);

            let numberIndex = Math.floor(rng() * 9);
            let groupIndex = Math.floor(rng() * 9);
            let randomNumber = Math.floor(rng() * 9) + 1;

            gameState[groupIndex][numberIndex] = randomNumber;

            let old = [...actionHistory];
            old.push({
                type: "add-number",
                square: { numberIndex, groupIndex },
                newValue: randomNumber,
                previousValue: prevState[groupIndex][numberIndex],
            });

            let validation = validateGameState(gameState, old);
            if (validation.isValid) {
                actionHistory = [...old];
                break;
            } else {
                gameState = prevState.map(row => [...row]);
            }
        }
    }

    return {gameState, actionHistory};
}
