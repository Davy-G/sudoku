import {SudokuProvider} from "@/lib/contexts/SudokuContext.tsx";
import {GameComponent} from "@/components/GameComponent/GameComponent.tsx";


function App() {


    return (
        <SudokuProvider>
            <GameComponent/>
        </SudokuProvider>
    );
}

export default App;
