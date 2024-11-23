import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GRID_SIZE = 4;
const MAGIC_SUM = 34;
const MAX_NUMBER = 16;

export default function App() {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill("")));
  const [gameState, setGameState] = useState("initial"); // initial, playing, completed
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (gameState === "playing") {
      setMessage("");
    }
  }, [gameState]);

  const startGame = () => {
    setGrid(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill("")));
    setGameState("playing");
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newValue = value.replace(/\D/g, "").slice(0, 2);
    const numValue = parseInt(newValue, 10);

    if (numValue > MAX_NUMBER) return;

    const newGrid = grid.map((row) => [...row]);
    newGrid[rowIndex][colIndex] = newValue;
    setGrid(newGrid);
  };

  const checkSolution = () => {
    const isGridFull = grid.every((row) => row.every((cell) => cell !== ""));
    if (!isGridFull) {
      setMessage("Please fill all cells before submitting.");
      return;
    }

    const numGrid = grid.map((row) => row.map((cell) => parseInt(cell, 10)));

    const rowSums = numGrid.map((row) => row.reduce((sum, num) => sum + num, 0));
    const colSums = numGrid[0].map((_, colIndex) =>
      numGrid.reduce((sum, row) => sum + row[colIndex], 0)
    );
    const diag1Sum = numGrid.reduce((sum, row, i) => sum + row[i], 0);
    const diag2Sum = numGrid.reduce((sum, row, i) => sum + row[GRID_SIZE - 1 - i], 0);

    const isCorrect =
      rowSums.every((sum) => sum === MAGIC_SUM) &&
      colSums.every((sum) => sum === MAGIC_SUM) &&
      diag1Sum === MAGIC_SUM &&
      diag2Sum === MAGIC_SUM;

    setGameState("completed");
    setMessage(
      isCorrect
        ? "Congratulations! You've solved the magic square!"
        : "Sorry, that's not correct. Try again!"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Magic Square 4x4
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === "initial" ? (
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <Input
                    key={`${rowIndex}-${colIndex}`}
                    value={cell}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    className="w-full h-12 text-center text-lg font-bold"
                    disabled={gameState === "completed"}
                  />
                ))
              )}
            </div>
          )}
          {message && (
            <Alert className="mt-4">
              <AlertTitle>Result</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {gameState === "playing" && (
            <Button onClick={checkSolution} className="w-full">
              Submit
            </Button>
          )}
          {gameState === "completed" && (
            <Button onClick={startGame} className="w-full">
              Play Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}