import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GRID_SIZE = 4;
const VALID_SUM = 36;
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

  const handleInputChange = (rowIndex, colIndex, value) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1 || numValue > MAX_NUMBER) return;

    const newGrid = grid.map((row) => [...row]);
    newGrid[rowIndex][colIndex] = numValue;
    setGrid(newGrid);
  };

  const checkSum = (arr) => arr.reduce((sum, num) => sum + num, 0) === VALID_SUM;

  const verifyGrid = () => {
    const rows = grid;
    const cols = grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));
    const diag1 = grid.map((row, i) => row[i]);
    const diag2 = grid.map((row, i) => row[GRID_SIZE - 1 - i]);

    const allValid =
      rows.every(checkSum) &&
      cols.every(checkSum) &&
      checkSum(diag1) &&
      checkSum(diag2);

    setGameState("completed");
    setMessage(allValid ? "Congratulations! You won!" : "Sorry, that's not correct. Try again!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">4x4 Magic Square Game</CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === "initial" ? (
            <Button onClick={startGame} className="w-full">Start Game</Button>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <Input
                    key={`${rowIndex}-${colIndex}`}
                    type="number"
                    min="1"
                    max={MAX_NUMBER}
                    value={cell}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    className="w-full h-12 text-center text-lg font-bold"
                    disabled={gameState === "completed"}
                  />
                ))
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {gameState === "playing" && (
            <Button onClick={verifyGrid} className="w-full">Submit</Button>
          )}
          {gameState === "completed" && (
            <>
              <Alert variant={message.includes("Congratulations") ? "success" : "destructive"}>
                <AlertTitle>{message.split("!")[0]}!</AlertTitle>
                <AlertDescription>{message.split("!")[1]}</AlertDescription>
              </Alert>
              <Button onClick={startGame} className="w-full">Play Again</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}