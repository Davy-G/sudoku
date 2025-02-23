// Dependencies
import {useEffect, useState, useCallback} from 'react';

// Components
import GameBoard from '@/components/GameBoard/GameBoard';
import NumberKeyboard from '@/components/NumberKeyboard/NumberKeyboard';

// Types
import {Action, ActionHistory, GameState, SelectedSquare, ValidationResult} from '@/types';

// Utils
import {validateGameState} from '@/utils/game-state';
import ValidationGrid from "@/components/ValidationGrid/ValidationGrid.tsx";


const EMPTY_GAME_STATE: GameState = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
];

function App() {
    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);
    const [selectedNumberKey, setSelectedNumberKey] = useState<number | null>(null);
    const [gameState, setGameState] = useState<GameState>(EMPTY_GAME_STATE);
    const [actionHistory, setActionHistory] = useState<ActionHistory>([]);
    const [validationResult, setValidationResult] = useState<ValidationResult>({isValid: true});

    function addActionToHistory(action: Action) {
        setActionHistory((prevState) => [...prevState, action]);
    }

    const handleNumberClick = useCallback((numberIndex: number, groupIndex: number) => {
        if (selectedSquare?.numberIndex === numberIndex && selectedSquare?.groupIndex === groupIndex) {
            setSelectedSquare(null);
        } else {
            setSelectedSquare({numberIndex, groupIndex});
            if (selectedNumberKey) {
                const prevState = [...gameState];
                if (prevState[groupIndex][numberIndex] !== selectedNumberKey) {
                    setGameState((prevState) => {
                        const newState = [...prevState];
                        newState[groupIndex][numberIndex] = selectedNumberKey;
                        let validation = validateGameState(newState, actionHistory);
                        if (!validation.isValid) {
                            setValidationResult(validation);
                            newState[groupIndex][numberIndex] = null;
                            addActionToHistory({
                                type: 'remove-number',
                                square: {numberIndex, groupIndex},
                                newValue: null,
                                previousValue: prevState[groupIndex][numberIndex],
                            });
                            return newState;
                        }

                        setValidationResult(validation);
                        addActionToHistory({
                            type: 'add-number',
                            square: {numberIndex, groupIndex},
                            newValue: selectedNumberKey,
                            previousValue: prevState[groupIndex][numberIndex],
                        });
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
                    setGameState((prevState) => {
                        const newState = [...prevState];
                        newState[selectedSquare.groupIndex][selectedSquare.numberIndex] = number;
                        let validation = validateGameState(newState, actionHistory);
                        if (!validation.isValid) {
                            setValidationResult(validation);
                            newState[selectedSquare.groupIndex][selectedSquare.numberIndex] = null;
                            addActionToHistory({
                                type: 'remove-number',
                                square: selectedSquare,
                                newValue: null,
                                previousValue: prevState[selectedSquare.groupIndex][selectedSquare.numberIndex],
                            });
                            return newState;
                        }

                        setValidationResult(validation);
                        addActionToHistory({
                            type: 'add-number',
                            square: selectedSquare,
                            newValue: number,
                            previousValue: prevState[selectedSquare.groupIndex][selectedSquare.numberIndex],
                        });
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
                    // let validation = validateGameState(newState, actionHistory);
                    // if (!validation.isValid) {
                    //     setValidationResult(validation);
                    //     return newState;
                    // }
                    // setValidationResult(validation);

                    return newState;

                });

                addActionToHistory({
                    type: 'remove-number',
                    square: selectedSquare,
                    newValue: null,
                    previousValue: prevState[selectedSquare.groupIndex][selectedSquare.numberIndex],
                });


            }
        }
    }, [selectedSquare]);

    useEffect(() => {
        const validationResult = validateGameState(gameState, actionHistory);
        console.log(validationResult);
    }, [gameState, actionHistory]);

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen px-4">
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
