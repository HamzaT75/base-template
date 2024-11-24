import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Initial Sudoku board with some pre-filled numbers
const initialBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function SudokuCell({ value, onClick, isEditable, isSelected }) {
  const cellClasses = `w-10 h-10 sm:w-12 sm:h-12 border text-center flex items-center justify-center font-bold ${isEditable ? 'cursor-pointer' : 'cursor-not-allowed'} ${isSelected ? 'bg-blue-200' : 'bg-white'} ${value ? 'text-black' : 'text-blue-500'}`;

  return (
    <div onClick={isEditable ? onClick : undefined} className={cellClasses}>
      {value || ''}
    </div>
  );
}

function App() {
  const [board, setBoard] = useState(() => JSON.parse(JSON.stringify(initialBoard)));
  const [selectedCell, setSelectedCell] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // Timer logic
  useEffect(() => {
    let timer;
    if (!gameOver && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameOver]);

  const checkSudoku = useCallback(() => {
    for (let i = 0; i < 9; i++) {
      const row = new Set(), col = new Set(), box = new Set();
      for (let j = 0; j < 9; j++) {
        // Check row
        if (board[i][j] && row.has(board[i][j])) return false;
        row.add(board[i][j]);
        // Check column
        if (board[j][i] && col.has(board[j][i])) return false;
        col.add(board[j][i]);
        // Check 3x3 box
        const boxIndex = 3 * Math.floor(i / 3) + Math.floor(j / 3);
        if (board[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)] && box.has(board[boxIndex][3 * (i % 3) + (j % 3)])) return false;
        box.add(board[boxIndex][3 * (i % 3) + (j % 3)]);
      }
    }
    return true;
  }, [board]);

  useEffect(() => {
    if (checkSudoku() && board.flat().every(num => num !== 0)) {
      setGameOver(true);
      const endTime = new Date();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      alert(`You Win! Time taken: ${timeTaken} seconds`);
    }
  }, [board, checkSudoku, startTime]);

  const handleCellClick = (row, col) => {
    if (initialBoard[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyPress = (e) => {
    if (!selectedCell || gameOver) return;
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) {
      const newBoard = board.map(row => [...row]);
      newBoard[selectedCell.row][selectedCell.col] = num;
      setBoard(newBoard);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, board, gameOver]);

  const resetGame = () => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setTimeLeft(60);
    setGameOver(false);
    setStartTime(new Date());
  };

  const resetTimer = () => {
    setTimeLeft(60);
  };

  if (!startTime) setStartTime(new Date());

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-4">
        <CardHeader>
          <CardTitle>Sudoku Game</CardTitle>
          <div className="text-right text-sm">Time Left: {timeLeft}s</div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-9 gap-1">
            {board.map((row, rowIndex) => row.map((cell, colIndex) => (
              <SudokuCell 
                key={`${rowIndex}${colIndex}`} 
                value={cell || ''} 
                isEditable={cell === 0 && !gameOver}
                isSelected={selectedCell && rowIndex === selectedCell.row && colIndex === selectedCell.col}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            )))}
          </div>
        </CardContent>
        <div className="mt-4 flex justify-between">
          <Button onClick={resetGame}>Restart Game</Button>
          <Button onClick={resetTimer}>Reset Timer</Button>
        </div>
      </Card>
    </div>
  );
}

export default App;