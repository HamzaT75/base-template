import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define color options
const COLOR_NAMES = ["red", "yellow", "blue", "black"];
const COLORS = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-black"];


// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Component for individual cell
const Cell = ({ color, isHidden, isSelected, onClick }) => (
  <div
    className={`w-20 h-20 sm:w-24 sm:h-24 m-1 rounded-lg cursor-pointer transition-all duration-300 ${
      isHidden ? "bg-gray-200" : color
    } ${isSelected ? "ring-4 ring-purple-500" : ""}`}
    onClick={onClick}
  />
);

// Main game component
export default function App() {
  const [gameState, setGameState] = useState("idle");
  const [colors, setColors] = useState([]);
  const [targetColors, setTargetColors] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);

  // Initialize game
  const startGame = () => {
    const newColors = shuffleArray([...COLORS, ...COLORS, ...COLORS].slice(0, 9));
    setColors(newColors);
    setGameState("memorize");
    setTimer(5);
    setSelectedCells([]);
    setScore(0);
  };

  // Handle cell selection
  const handleCellClick = (index) => {
    if (gameState !== "select" || selectedCells.includes(index)) return;
    setSelectedCells([...selectedCells, index]);
  };

  // Calculate score
  const calculateScore = () => {
    let newScore = 0;
    let penalty = 1;
    selectedCells.forEach((cellIndex) => {
      if (targetColors.includes(colors[cellIndex])) {
        newScore += 5;
      } else {
        newScore -= penalty;
        penalty *= 2;
      }
    });
    setScore(newScore);
  };

  // Game logic using useEffect
  useEffect(() => {
    let interval;
    if (gameState === "memorize" && timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    } else if (gameState === "memorize" && timer === 0) {
      setGameState("select");
      setTargetColors(shuffleArray(COLORS.slice(0, 2)));
      setTimer(10);
    } else if (gameState === "select" && timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    } else if (gameState === "select" && timer === 0) {
      calculateScore();
      setGameState("result");
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const getTargetColors = () => {
    let targetColorList = [];
    targetColors.forEach((color, index) => {
        targetColorList.push(COLOR_NAMES[COLORS.indexOf(color)]);
    })
    return targetColorList;
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-96 sm:w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Color Matching Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === "idle" && (
            <div className="text-center">
              <p className="mb-4">Match the colors and test your memory!</p>
              <Button onClick={startGame}>Start Game</Button>
            </div>
          )}
          {(gameState === "memorize" || gameState === "select") && (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {colors.map((color, index) => (
                  <Cell
                    key={index}
                    color={color}
                    isHidden={gameState === "select"}
                    isSelected={selectedCells.includes(index)}
                    onClick={() => handleCellClick(index)}
                  />
                ))}
              </div>
              <div className="text-right font-bold">Time: {timer}s</div>
              {gameState === "select" && (
                <p className="mt-2 text-center">
                  Select all cells that had the {getTargetColors().join(" and ")} color.
                </p>
              )}
            </>
          )}
          {gameState === "result" && (
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">Your Score: {score}</p>
              <p>
                {score > 15
                  ? "Great job! Your memory is impressive!"
                  : score > 0
                  ? "Good effort! Keep practicing to improve."
                  : "Don't worry, try again to beat your score!"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          {gameState === "result" && <Button onClick={startGame}>Play Again</Button>}
        </CardFooter>
      </Card>
    </div>
  );
}