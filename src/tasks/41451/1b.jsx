import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function MagicSquare() {
  const [board, setBoard] = useState(Array(16).fill(''));
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [error, setError] = useState(null);

  const checkMagicSquare = useCallback(() => {
    const numbers = board.map(Number);
    const targetSum = 34; // Correct sum for a 4x4 magic square is actually 34, not 36

    // Check rows and columns
    for (let i = 0; i < 4; i++) {
      let rowSum = 0, colSum = 0;
      for (let j = 0; j < 4; j++) {
        rowSum += numbers[i * 4 + j];
        colSum += numbers[j * 4 + i];
      }
      if (rowSum !== targetSum || colSum !== targetSum) {
        setGameState('lost');
        return;
      }
    }

    // Check diagonals
    let diag1 = 0, diag2 = 0;
    for (let i = 0; i < 4; i++) {
      diag1 += numbers[i * 4 + i];
      diag2 += numbers[i * 4 + 3 - i];
    }
    if (diag1 !== targetSum || diag2 !== targetSum) {
      setGameState('lost');
      return;
    }

    setGameState('won');
  }, [board]);

  const handleChange = (index, value) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1 || numValue > 16) {
      setError(`Please enter a number between 1 and 16 at position ${index + 1}.`);
      return;
    }
    setError(null);
    const newBoard = [...board];
    newBoard[index] = value;
    setBoard(newBoard);
  };

  const startGame = () => {
    setBoard(Array(16).fill(''));
    setGameState('playing');
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>4x4 Magic Square Game</CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === 'playing' && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {board.map((value, index) => (
                <Input 
                  key={index}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={`${index + 1}`}
                  className="text-center"
                />
              ))}
            </div>
          )}
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {gameState === 'playing' ? (
            <Button onClick={checkMagicSquare}>Submit</Button>
          ) : (
            <div className="text-center">
              <p className="mb-2">
                {gameState === 'won' ? 'Congratulations! You solved the magic square!' : 'Sorry, that\'s not correct.'}
              </p>
              <Button onClick={startGame}>Play Again</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <MagicSquare />;
}