// Dependencies
import {useEffect, useState, useCallback, useRef} from 'react';

// Components
import GameBoard from '@/components/GameBoard/GameBoard';
import NumberKeyboard from '@/components/NumberKeyboard/NumberKeyboard';

// Types
import {GameState, SelectedSquare, ValidationResult} from '@/types';

// Utils
import {validateGameState} from '@/utils/game-state';
import ValidationGrid from "@/components/ValidationGrid/ValidationGrid.tsx";
import ErrorCount from "@/components/MistakeCount/MistakeCount.tsx";
import {GenerateBoard} from "@/utils/GenerateBoard.ts";


// let actionHistory: ActionHistory = [];

const initialBoard = GenerateBoard(3);




function App() {

    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);
    const [selectedNumberKey, setSelectedNumberKey] = useState<number | null>(null);
    const [gameState, setGameState] = useState<GameState>(initialBoard[0]);
    const [actionHistory, setActionHistory] = useState(initialBoard[1]);
    // const [actionHistory, setActionHistory] = useState<ActionHistory>([]);
    const [validationResult, setValidationResult] = useState<ValidationResult>({isValid: true});
    const [Mistake, SetMistake] = useState<number>(0);
    const isStrictMode = useRef(false); // Prevent double increment in Strict Mode

    const handleMistake = () => {
        if (!isStrictMode.current) {
            isStrictMode.current = true;
            setTimeout(() => (isStrictMode.current = false), 0); // Reset after state update
            SetMistake((prev) => prev + 1);
        }
    };

    const handleNumberClick = useCallback((numberIndex: number, groupIndex: number) => {
        if (selectedSquare?.numberIndex === numberIndex && selectedSquare?.groupIndex === groupIndex) {
            setSelectedSquare(null);
        } else {
            setSelectedSquare({numberIndex, groupIndex});
            if (selectedNumberKey) {
                const prevState = [...gameState];
                if (prevState[groupIndex][numberIndex] !== selectedNumberKey) {
                    // let old = [...actionHistory];
                    // old.push({
                    //     type: 'add-number',
                    //     square: {numberIndex, groupIndex},
                    //     newValue: selectedNumberKey,
                    //     previousValue: prevState[groupIndex][numberIndex],
                    // });
                    // setActionHistory(old);
                    setActionHistory(prevHistory => [
                        ...prevHistory,
                        {
                            type: 'add-number',
                            square: { numberIndex, groupIndex },
                            newValue: selectedNumberKey,
                            previousValue: prevState[groupIndex][numberIndex],
                        }
                    ]);

                    setGameState((prevState) => {
                        const newState = [...prevState];
                        newState[groupIndex][numberIndex] = selectedNumberKey;
                        let validation = validateGameState(newState, actionHistory);
                        if (!validation.isValid) {
                            handleMistake();
                            setValidationResult(validation);
                            newState[groupIndex][numberIndex] = null;
                            // old.pop();
                            // actionHistory = old;
                            return newState;
                        }

                        setValidationResult(validation);

                        return newState;
                    });


                }
            }
        }
    }, [selectedSquare, selectedNumberKey]);

    const handleNumberKeyClick = useCallback((number: number) => {
        if (selectedNumberKey === number) {
            setSelectedNumberKey(null);
        } else {
            setSelectedNumberKey(number);
            if (selectedSquare) {
                const prevState = [...gameState];
                if (prevState[selectedSquare.groupIndex][selectedSquare.numberIndex] !== number) {
                    // let old = [...actionHistory];
                    // old.push({
                    //     type: 'add-number',
                    //     square: selectedSquare,
                    //     newValue: number,
                    //     previousValue: prevState[selectedSquare.groupIndex][selectedSquare.numberIndex],
                    // });
                    // actionHistory = old;
                    setActionHistory(prevHistory => [
                        ...prevHistory,
                        {
                            type: 'add-number',
                            square: selectedSquare,
                            newValue: number,
                            previousValue: prevState[selectedSquare.groupIndex][selectedSquare.numberIndex],
                        }
                    ]);

                    setGameState((prevState) => {
                        const newState = [...prevState];
                        newState[selectedSquare.groupIndex][selectedSquare.numberIndex] = number;
                        let validation = validateGameState(newState, actionHistory);
                        if (!validation.isValid) {
                            // SetMistake(prevCount => prevCount + 1);
                            setValidationResult(validation);
                            newState[selectedSquare.groupIndex][selectedSquare.numberIndex] = null;
                            // old.pop();
                            // actionHistory = old;
                            return newState;
                        }

                        setValidationResult(validation);

                        return newState;
                    });

                }
            }
        }
    }, [selectedSquare, selectedNumberKey]);

    const handleClearClick = useCallback(() => {
        if (selectedSquare) {
            const prevState = [...gameState];
            if (prevState[selectedSquare.groupIndex][selectedSquare.numberIndex] !== null) {
                setGameState((prevState) => {
                    const newState = [...prevState];
                    newState[selectedSquare.groupIndex][selectedSquare.numberIndex] = null;
                    return newState;
                });
                // let old = [...actionHistory];
                // old.push({
                //     type: 'remove-number',
                //     square: selectedSquare,
                //     newValue: null,
                //     previousValue: prevState[selectedSquare.groupIndex][selectedSquare.numberIndex],
                // });
                // actionHistory = old;


            }
        }
    }, [selectedSquare]);

    useEffect(() => {
        const validationResult = validateGameState(gameState, actionHistory);
        console.log(validationResult);
    }, [gameState, actionHistory]);

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

export default App;
