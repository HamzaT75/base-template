import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function to generate a valid Sudoku puzzle
const generateSudoku = () => {
  // This is a simplified version that generates a partially filled grid
  const grid = Array(9).fill().map(() => Array(9).fill(0));
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Fill in some random cells
  for (let i = 0; i < 20; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    const num = nums[Math.floor(Math.random() * nums.length)];
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
    }
  }
  
  return grid;
};

// Helper function to check if a number is valid in a given position
const isValid = (board, row, col, num) => {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }
  
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }
  
  return true;
};

// Helper function to check if the board is completely filled
const isBoardFilled = (board) => {
  return board.every(row => row.every(cell => cell !== 0));
};

export default function App() {
  const [board, setBoard] = useState(() => generateSudoku());
  const [selectedCell, setSelectedCell] = useState(null);
  const [time, setTime] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  // Timer effect
  useEffect(() => {
    if (time > 0 && !gameOver && !win) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time === 0) {
      setGameOver(true);
    }
  }, [time, gameOver, win]);

  // Check win condition
  useEffect(() => {
    if (isBoardFilled(board) && !gameOver) {
      setWin(true);
      setGameOver(true);
    }
  }, [board, gameOver]);

  // Handle cell selection
  const handleCellClick = (row, col) => {
    if (!gameOver && board[row][col] === 0) {
      setSelectedCell([row, col]);
    }
  };

  // Handle number input
  const handleNumberInput = useCallback((num) => {
    if (selectedCell && !gameOver) {
      const [row, col] = selectedCell;
      if (isValid(board, row, col, num)) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = num;
        setBoard(newBoard);
      }
    }
  }, [selectedCell, board, gameOver]);

  // Handle key press for number input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNumberInput]);

  // Restart game
  const restartGame = () => {
    setBoard(generateSudoku());
    setSelectedCell(null);
    setTime(60);
    setGameOver(false);
    setWin(false);
  };

  // Reset timer
  const resetTimer = () => {
    setTime(60);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sudoku</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-9 gap-0.5 mb-4">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square flex items-center justify-center text-lg font-bold border ${
                    selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                      ? 'bg-blue-200'
                      : 'bg-white'
                  } ${colIndex % 3 === 2 ? 'border-r-2' : ''} ${rowIndex % 3 === 2 ? 'border-b-2' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              ))
            )}
          </div>
          <div className="text-center mb-4">
            <span className="text-xl font-bold">Time: {time}s</span>
          </div>
          {gameOver && (
            <div className="text-center mb-4">
              <span className="text-xl font-bold">
                {win ? `You Win! Time taken: ${60 - time}s` : "Game Over!"}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={restartGame}>Restart Game</Button>
          <Button onClick={resetTimer}>Reset Timer</Button>
        </CardFooter>
      </Card>
    </div>
  );
}