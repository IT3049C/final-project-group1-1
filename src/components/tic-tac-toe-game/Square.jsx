export function Square({ value, onSquareClick, disabled = false }) {
    return (
    <button 
    className="square" 
    onClick={onSquareClick}
    disabled={disabled}
    >{value}</button>
    );
}