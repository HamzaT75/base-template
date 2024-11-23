import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MagicSquare = () => {
  const [grid, setGrid] = useState(Array(4).fill().map(() => Array(4).fill('')));
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'end'
  const [message, setMessage] = useState('');

  // Check if the number is valid (1-16)
  const isValidNumber = (num) => num === '' || (num >= 1 && num <= 16 && !isNaN(num));

  // Handle cell changes
  const handleChange = (row, col, value) => {
    if (gameState !== 'playing') return;
    if (isValidNumber(value)) {
      let newGrid = [...grid];
      newGrid[row][col] = value === '' ? '' : parseInt(value, 10);
      setGrid(newGrid);
    }
  };

  // Check if the magic square conditions are met
  const checkMagicSquare = () => {
    const targetSum = 34;
    let sums = [];

    // Check rows and columns
    for (let i = 0; i < 4; i++) {
      sums.push(grid[i].reduce((a, b) => a + (b || 0), 0)); // Rows
      sums.push(grid.reduce((a, b) => a + (b[i] || 0), 0)); // Columns
    }

    // Check diagonals
    sums.push(grid.reduce((a, b, idx) => a + (b[idx] || 0), 0)); // Main diagonal
    sums.push(grid.reduce((a, b, idx) => a + (b[3 - idx] || 0), 0)); // Secondary diagonal

    return sums.every(sum => sum === targetSum);
  };

  const onSubmit = () => {
    if (checkMagicSquare()) {
      setMessage("Congratulations! You've solved the Magic Square!");
      setGameState('end');
    } else {
      setMessage('Oops! That\'s not correct. Try again.');
      setGameState('end');
    }
  };

  const startGame = () => {
    setGrid(Array(4).fill().map(() => Array(4).fill('')));
    setMessage('');
    setGameState('playing');
  };

  const restartGame = () => {
    startGame();
  };

  useEffect(() => {
    if (gameState === 'start') startGame();
  }, [gameState]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gradient-to-br from-blue-400 to-purple-500 min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Magic Square Game</CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === 'end' && (
            <div className="mb-4 text-center text-lg font-semibold">{message}</div>
          )}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {grid.map((row, i) => row.map((cell, j) => (
              <Input 
                key={`${i}-${j}`}
                type="number"
                value={cell}
                onChange={(e) => handleChange(i, j, e.target.value)}
                disabled={gameState !== 'playing'}
                className="text-center"
                min="1"
                max="16"
              />
            )))}
          </div>
          {gameState === 'playing' && (
            <Button onClick={onSubmit} className="w-full">Submit</Button>
          )}
          {gameState !== 'playing' && (
            <Button onClick={gameState === 'start' ? startGame : restartGame} className="w-full">
              {gameState === 'start' ? 'Start Game' : 'Restart Game'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <MagicSquare />;
}