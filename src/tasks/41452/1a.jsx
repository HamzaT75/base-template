import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 4;
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Utility function to shuffle array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Component for each cell in the grid
const Cell = React.memo(({ number, onClick, revealed, matched }) => {
  const handleClick = () => !revealed && !matched && onClick();

  return (
    <div 
      className={`w-full h-full flex items-center justify-center cursor-pointer transition-transform transform ${revealed || matched ? 'scale-y-100' : 'scale-y-0'} ${matched ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} rounded-lg`} 
      onClick={handleClick}
    >
      {revealed || matched ? <span className="text-white text-2xl">{number}</span> : null}
    </div>
  );
});

// Main App component
export default function App() {
  const [board, setBoard] = useState([]);
  const [firstPick, setFirstPick] = useState(null);
  const [secondPick, setSecondPick] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize or reset the game
  const initializeGame = useCallback(() => {
    const numbers = [...NUMBERS, ...NUMBERS];
    const shuffledNumbers = shuffleArray(numbers);
    setBoard(shuffledNumbers.map((num, idx) => ({ id: idx, number: num, revealed: false, matched: false })));
    setFirstPick(null);
    setSecondPick(null);
    setScore(0);
    setTimeLeft(20);
    setMoves(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timerId = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  // Game logic for cell click
  const handleCellClick = (cell) => {
    if (gameOver) return;

    if (!firstPick) {
      setFirstPick(cell);
      setBoard(board => board.map(c => c.id === cell.id ? { ...c, revealed: true } : c));
    } else if (!secondPick && cell.id !== firstPick.id) {
      setMoves(moves + 1);
      setSecondPick(cell);
      setBoard(board => board.map(c => c.id === cell.id ? { ...c, revealed: true } : c));
      
      if (firstPick.number === cell.number) {
        setScore(score => score + 1);
        setBoard(board => 
          board.map(c => 
            c.id === firstPick.id || c.id === cell.id ? { ...c, matched: true } : c
          )
        );
        setFirstPick(null);
        setSecondPick(null);
        if (board.every(c => c.matched)) {
          setGameOver(true);
        }
      } else {
        setTimeout(() => {
          setBoard(board => 
            board.map(c => 
              c.id === firstPick.id || c.id === cell.id ? { ...c, revealed: false } : c
            )
          );
          setFirstPick(null);
          setSecondPick(null);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md mb-4">
        <CardHeader>
          <CardTitle>Number Match Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {board.map(cell => 
              <Cell key={cell.id} {...cell} onClick={() => handleCellClick(cell)} />
            )}
          </div>
          <div className="flex justify-between mb-2">
            <span>Time: {timeLeft}s</span>
            <span>Score: {score}</span>
            <span>Moves: {moves}</span>
          </div>
        </CardContent>
        <Button onClick={initializeGame} disabled={!gameOver && timeLeft > 0} className="mb-2">
          {gameOver || timeLeft === 0 ? 'Restart' : 'Game in Progress'}
        </Button>
      </Card>
      {gameOver && (
        <Card className="w-full max-w-md mt-4">
          <CardContent>
            <p>Game Over! Your score is {score}.</p>
            <p>Time taken: {20 - timeLeft} seconds</p>
            <p>Moves made: {moves}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}