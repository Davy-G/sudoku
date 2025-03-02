// Definition: This component is used to display the number of mistakes made by the user.

interface ErrorCountProps {
    errorCount: number;
}
export default function ErrorCount({errorCount}: ErrorCountProps) {
    return (
        <div className="text-3xl border-red-600 text-red-500">
            Mistakes: {errorCount}
        </div>
    );
}


