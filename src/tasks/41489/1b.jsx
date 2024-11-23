import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Array of words to use in the game
const wordList = [
  "apple", "banana", "cherry", "date", "elderberry",
  "fig", "grape", "honeydew", "kiwi", "lemon",
  "mango", "nectarine", "orange", "papaya", "quince",
  "raspberry", "strawberry", "tangerine", "ugli", "vanilla",
  "watermelon", "xigua", "yuzu", "zucchini", "apricot"
];

// Function to get random words from the wordList
const getRandomWords = (count) => {
  const shuffled = [...wordList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function App() {
  const [gridSize, setGridSize] = useState({ n: 3, m: 3 });
  const [displayTime, setDisplayTime] = useState(7);
  const [guessTime, setGuessTime] = useState(7);
  const [gameState, setGameState] = useState("setup");
  const [words, setWords] = useState([]);
  const [newWords, setNewWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [timer, setTimer] = useState(0);

  // Function to start the game
  const startGame = () => {
    const totalCells = gridSize.n * gridSize.m;
    const initialWords = getRandomWords(totalCells);
    setWords(initialWords);
    setGameState("display");
    setTimer(displayTime);
  };

  // Function to handle word selection
  const handleWordSelect = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Effect to handle game state changes
  useEffect(() => {
    let interval;
    if (gameState === "display" && timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    } else if (gameState === "display" && timer === 0) {
      const halfCount = Math.floor(words.length / 2);
      const remainingWords = words.slice(0, halfCount);
      const newRandomWords = getRandomWords(words.length - halfCount);
      setNewWords([...remainingWords, ...newRandomWords].sort(() => 0.5 - Math.random()));
      setGameState("guess");
      setTimer(guessTime);
    } else if (gameState === "guess" && timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    } else if (gameState === "guess" && timer === 0) {
      const correctWords = words.slice(0, Math.floor(words.length / 2));
      const correctGuesses = selectedWords.filter((word) => correctWords.includes(word));
      setCorrectCount(correctGuesses.length);
      setGameState("result");
    }
    return () => clearInterval(interval);
  }, [gameState, timer, words, guessTime]);

  // Function to reset the game
  const resetGame = () => {
    setGridSize({ n: 3, m: 3 });
    setDisplayTime(7);
    setGuessTime(7);
    setGameState("setup");
    setWords([]);
    setNewWords([]);
    setSelectedWords([]);
    setCorrectCount(0);
    setTimer(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Word Remembering Game</CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === "setup" && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="gridN">Grid Width (2-5)</Label>
                  <Input
                    id="gridN"
                    type="number"
                    min="2"
                    max="5"
                    value={gridSize.n}
                    onChange={(e) => setGridSize({ ...gridSize, n: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="gridM">Grid Height (2-5)</Label>
                  <Input
                    id="gridM"
                    type="number"
                    min="2"
                    max="5"
                    value={gridSize.m}
                    onChange={(e) => setGridSize({ ...gridSize, m: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="displayTime">Display Time (1-10 seconds)</Label>
                <Input
                  id="displayTime"
                  type="number"
                  min="1"
                  max="10"
                  value={displayTime}
                  onChange={(e) => setDisplayTime(parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="guessTime">Guess Time (3-10 seconds)</Label>
                <Input
                  id="guessTime"
                  type="number"
                  min="3"
                  max="10"
                  value={guessTime}
                  onChange={(e) => setGuessTime(parseInt(e.target.value))}
                />
              </div>
              <Button onClick={startGame} className="w-full">Start Game</Button>
            </div>
          )}
          {(gameState === "display" || gameState === "guess") && (
            <div>
              <div className="text-center mb-4">Time left: {timer} seconds</div>
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${gridSize.n}, minmax(0, 1fr))`,
                }}
              >
                {(gameState === "display" ? words : newWords).map((word, index) => (
                  <Button
                    key={index}
                    variant={selectedWords.includes(word) ? "default" : "outline"}
                    className="h-16 text-sm"
                    onClick={() => gameState === "guess" && handleWordSelect(word)}
                    disabled={gameState === "display"}
                  >
                    {word}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {gameState === "result" && (
            <div className="text-center">
              <p className="mb-4">
                You got {correctCount} out of {Math.floor(words.length / 2)} words correct!
              </p>
              {correctCount === Math.floor(words.length / 2) && (
                <p className="text-green-600 font-bold mb-4">Congratulations! You won!</p>
              )}
              <Button onClick={resetGame}>Play Again</Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          {gameState !== "setup" && <Button onClick={resetGame}>Reset Game</Button>}
        </CardFooter>
      </Card>
    </div>
  );
}