import ErrorCount from "@/components/MistakeCount/MistakeCount.tsx";
import GameBoard from "@/components/GameBoard/GameBoard.tsx";
import NumberKeyboard from "@/components/NumberKeyboard/NumberKeyboard.tsx";
import ValidationGrid from "@/components/ValidationGrid/ValidationGrid.tsx";
import {useSudoku} from "@/lib/contexts/SudokuContext.tsx";


export function GameComponent() {
    const {
        gameState,
        handleClearClick,
        handleNumberClick,
        handleNumberKeyClick,
        Mistake,
        selectedNumberKey,
        selectedSquare,
        validationResult
    } = useSudoku();
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen px-4">
            <ErrorCount errorCount={Mistake}/>
            <GameBoard
                gameState={gameState}
                onNumberClick={handleNumberClick}
                selectedSquare={selectedSquare}
            />
            <NumberKeyboard
                selectedNumber={selectedNumberKey}
                onNumberClick={handleNumberKeyClick}
                onClearClick={handleClearClick}
            />
            <ValidationGrid validationResult={validationResult}/>
        </div>
    );
}