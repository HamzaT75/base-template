import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Utility function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Cell component for each number in the grid
const Cell = ({ value, isFlipped, onClick }) => (
  <div
    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg cursor-pointer transition-all duration-300 transform ${
      isFlipped ? "rotate-y-180" : ""
    }`}
    onClick={onClick}
  >
    <div className="relative w-full h-full">
      <div
        className={`absolute w-full h-full bg-purple-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold ${
          isFlipped ? "opacity-0" : "opacity-100"
        }`}
      >
        ?
      </div>
      <div
        className={`absolute w-full h-full bg-green-400 rounded-lg flex items-center justify-center text-white text-2xl font-bold ${
          isFlipped ? "opacity-100" : "opacity-0"
        }`}
      >
        {value}
      </div>
    </div>
  </div>
);

export default function App() {
  const [numbers, setNumbers] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [isGameOver, setIsGameOver] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize the game
  useEffect(() => {
    restartGame();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timer > 0 && !isGameOver) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timer === 0) {
      setIsGameOver(true);
    }
  }, [timer, isGameOver]);

  // Check for matches
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      if (numbers[first] === numbers[second]) {
        setMatchedPairs([...matchedPairs, numbers[first]]);
        setScore(score + 1);
        setFlippedIndices([]);
      } else {
        const timerId = setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
        return () => clearTimeout(timerId);
      }
      setMoves(moves + 1);
    }
  }, [flippedIndices, numbers, matchedPairs, score, moves]);

  const handleCellClick = (index) => {
    if (isGameOver || flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    setFlippedIndices([...flippedIndices, index]);
  };

  const restartGame = () => {
    const newNumbers = shuffleArray([...Array(8)].flatMap((_, i) => [i + 1, i + 1]));
    setNumbers(newNumbers);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(0);
    setTimer(20);
    setIsGameOver(false);
    setMoves(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between mb-4">
            <div className="text-lg font-semibold">Score: {score}</div>
            <div className="text-lg font-semibold">Time: {timer}s</div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {numbers.map((number, index) => (
              <Cell
                key={index}
                value={number}
                isFlipped={flippedIndices.includes(index) || matchedPairs.includes(number)}
                onClick={() => handleCellClick(index)}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={restartGame}>Restart</Button>
          {isGameOver && (
            <div className="text-center">
              <p className="font-semibold">Game Over!</p>
              <p>Final Score: {score}</p>
              <p>Moves: {moves}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}