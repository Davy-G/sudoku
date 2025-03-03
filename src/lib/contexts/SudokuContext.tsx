import {GenerateBoard} from "@/utils/GenerateBoard.ts";
import React, {createContext, ReactNode, useCallback, useContext, useRef, useState} from "react";
import {ActionHistory, GameState, SelectedSquare, ValidationResult} from "@/types";
import {validateGameState} from "@/utils/game-state.ts";


interface SudokuContextType {
    board: { gameState: GameState, actionHistory: ActionHistory };
    selectedSquare: SelectedSquare;
    selectedNumberKey: number | null;
    gameState: GameState;
    actionHistory: ActionHistory;
    validationResult: ValidationResult;
    Mistake: number;
    isStrictMode: React.MutableRefObject<boolean>;
    HandleMistake: () => void;
    handleNumberClick: (numberIndex: number, groupIndex: number) => void;
    handleNumberKeyClick: (number: number) => void;
    handleClearClick: () => void;

}

const SudokuContext = createContext<SudokuContextType | undefined>(undefined);

export const SudokuProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const initialBoard = GenerateBoard(3);
    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);
    const [selectedNumberKey, setSelectedNumberKey] = useState<number | null>(null);
    const [gameState, setGameState] = useState<GameState>(initialBoard.gameState);
    // const [actionHistory, setActionHistory] = useState(initialBoard.actionHistory);
    let actionHistory = initialBoard.actionHistory;
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
                    // setActionHistory(prevHistory => [
                    //     ...prevHistory,
                    //     {
                    //         type: 'add-number',
                    //         square: {numberIndex, groupIndex},
                    //         newValue: selectedNumberKey,
                    //         previousValue: prevState[groupIndex][numberIndex],
                    //     }
                    // ]);
                    let old = [...actionHistory];
                    old.push({
                        type: 'add-number',
                        square: {numberIndex, groupIndex},
                        newValue: selectedNumberKey,
                        previousValue: prevState[groupIndex][numberIndex],
                    });
                    actionHistory = old;

                    setGameState((prevState) => {
                        const newState = [...prevState];
                        newState[groupIndex][numberIndex] = selectedNumberKey;
                        let validation = validateGameState(newState, actionHistory);
                        if (!validation.isValid) {
                            handleMistake();
                            setValidationResult(validation);
                            newState[groupIndex][numberIndex] = null;
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
                    // setActionHistory(prevHistory => [
                    //     ...prevHistory,
                    //     {
                    //         type: 'add-number',
                    //         square: selectedSquare,
                    //         newValue: number,
                    //         previousValue: prevState[selectedSquare.groupIndex][selectedSquare.numberIndex],
                    //     }
                    // ]);

                    let old = [...actionHistory];
                    old.push({
                        type: 'add-number',
                        square: selectedSquare,
                        newValue: number,
                        previousValue: prevState[selectedSquare.groupIndex][selectedSquare.numberIndex],
                    });
                    actionHistory = old;

                    setGameState((prevState) => {
                        const newState = [...prevState];
                        newState[selectedSquare.groupIndex][selectedSquare.numberIndex] = number;
                        let validation = validateGameState(newState, actionHistory);
                        if (!validation.isValid) {
                            setValidationResult(validation);
                            newState[selectedSquare.groupIndex][selectedSquare.numberIndex] = null;
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
            }
        }
    }, [selectedSquare]);

    return (
        <SudokuContext.Provider value={{
            board: initialBoard,
            selectedSquare,
            selectedNumberKey,
            gameState,
            actionHistory,
            validationResult,
            Mistake,
            isStrictMode,
            HandleMistake: handleMistake,
            handleNumberClick,
            handleNumberKeyClick,
            handleClearClick
        }}>
            {children}
        </SudokuContext.Provider>
    );
};
export const useSudoku = (): SudokuContextType => {
    const context = useContext(SudokuContext);
    if (!context) {
        throw new Error("useSudoku must be used within a SudokuProvider");
    }
    return context;
};

