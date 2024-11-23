import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Array of words to use in the game
const words = [
  "Apple", "Banana", "Cherry", "Date", "Elderberry",
  "Fig", "Grape", "Honeydew", "Kiwi", "Lemon",
  "Mango", "Nectarine", "Orange", "Papaya", "Quince",
  "Raspberry", "Strawberry", "Tangerine", "Ugli", "Watermelon"
];

// Function to get random words
const getRandomWords = (count) => {
  return [...words].sort(() => 0.5 - Math.random()).slice(0, count);
};

// Game component
const Game = ({ rows, cols, displayTime, guessTime }) => {
  const [gameState, setGameState] = useState("initial");
  const [initialGrid, setInitialGrid] = useState([]);
  const [currentGrid, setCurrentGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [result, setResult] = useState({ correct: 0, missed: 0 });

  // Initialize the game
  useEffect(() => {
    if (gameState === "started") {
      const newGrid = Array(rows).fill().map(() => getRandomWords(cols));
      setInitialGrid(newGrid);
      setCurrentGrid(newGrid);
      
      // Hide words after displayTime
      setTimeout(() => {
        const updatedGrid = newGrid.map(row =>
          row.map(word => Math.random() < 0.5 ? word : getRandomWords(1)[0])
        );
        setCurrentGrid(updatedGrid);
        setGameState("guessing");
        
        // End game after guessTime
        setTimeout(() => {
          setGameState("ended");
          calculateResult();
        }, guessTime * 1000);
      }, displayTime * 1000);
    }
  }, [gameState, rows, cols, displayTime, guessTime]);

  // Handle cell click
  const handleCellClick = (rowIndex, colIndex) => {
    if (gameState !== "guessing") return;
    const cellKey = `${rowIndex}-${colIndex}`;
    setSelectedCells(prev =>
      prev.includes(cellKey) ? prev.filter(key => key !== cellKey) : [...prev, cellKey]
    );
  };

  // Calculate result
  const calculateResult = () => {
    let correct = 0;
    let missed = 0;
    initialGrid.forEach((row, rowIndex) => {
      row.forEach((word, colIndex) => {
        const cellKey = `${rowIndex}-${colIndex}`;
        if (word === currentGrid[rowIndex][colIndex]) {
          if (selectedCells.includes(cellKey)) {
            correct++;
          } else {
            missed++;
          }
        }
      });
    });
    setResult({ correct, missed });
  };

  // Render grid
  const renderGrid = (grid) => (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {grid.map((row, rowIndex) =>
        row.map((word, colIndex) => (
          <Button
            key={`${rowIndex}-${colIndex}`}
            variant={selectedCells.includes(`${rowIndex}-${colIndex}`) ? "secondary" : "outline"}
            className="h-20 text-sm sm:text-base"
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {word}
          </Button>
        ))
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Word Remembering Game</CardTitle>
      </CardHeader>
      <CardContent>
        {gameState === "initial" && (
          <Button onClick={() => setGameState("started")}>Start Game</Button>
        )}
        {gameState === "started" && renderGrid(initialGrid)}
        {gameState === "guessing" && renderGrid(currentGrid)}
        {gameState === "ended" && (
          <div>
            <p>Correct: {result.correct}</p>
            <p>Missed: {result.missed}</p>
            {result.missed === 0 && <p className="font-bold">Congratulations! You won!</p>}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {gameState === "guessing" && (
          <Button onClick={() => { setGameState("ended"); calculateResult(); }}>Submit</Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Main App component
export default function App() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [displayTime, setDisplayTime] = useState(7);
  const [guessTime, setGuessTime] = useState(7);
  const [key, setKey] = useState(0);

  // Reset game
  const resetGame = () => {
    setRows(3);
    setCols(3);
    setDisplayTime(7);
    setGuessTime(7);
    setKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Word Remembering Game</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="rows">Rows (2-5)</Label>
          <Input
            id="rows"
            type="number"
            min="2"
            max="5"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="cols">Columns (2-5)</Label>
          <Input
            id="cols"
            type="number"
            min="2"
            max="5"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="displayTime">Display Time (1-10 seconds)</Label>
          <Slider
            id="displayTime"
            min={1}
            max={10}
            step={1}
            value={[displayTime]}
            onValueChange={(value) => setDisplayTime(value[0])}
          />
          <span>{displayTime} seconds</span>
        </div>
        <div>
          <Label htmlFor="guessTime">Guess Time (3-10 seconds)</Label>
          <Slider
            id="guessTime"
            min={3}
            max={10}
            step={1}
            value={[guessTime]}
            onValueChange={(value) => setGuessTime(value[0])}
          />
          <span>{guessTime} seconds</span>
        </div>
      </div>
      <Button onClick={resetGame} className="mb-4">Reset</Button>
      <Game
        key={key}
        rows={rows}
        cols={cols}
        displayTime={displayTime}
        guessTime={guessTime}
      />
    </div>
  );
}