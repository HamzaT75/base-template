import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Word generation function
const generateWord = () => {
  const operators = ["+", "-", "*", "/"];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = operators[Math.floor(Math.random() * operators.length)];
  return `${num1}${operator}${num2}`;
};

// Tower component
const Tower = ({ color, words, removeWord }) => (
  <div className={`w-1/3 px-2 ${color === "red" ? "bg-red-200" : color === "green" ? "bg-green-200" : "bg-blue-200"} rounded-lg overflow-hidden`}>
    <h2 className="text-xl font-bold mb-2">{words.length} words</h2>
    <div className="h-96 overflow-y-auto">
      {words.map((word, index) => (
        <div key={index} className="bg-white mb-1 p-1 rounded text-center animate-fall">
          {word}
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState("idle");
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [towers, setTowers] = useState({
    red: [],
    green: [],
    blue: [],
  });

  // Add word to a random tower
  const addWord = useCallback(() => {
    const colors = ["red", "green", "blue"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newWord = generateWord();
    setTowers((prev) => ({
      ...prev,
      [randomColor]: [...prev[randomColor], newWord],
    }));
  }, []);

  // Game loop
  useEffect(() => {
    let interval;
    if (gameState === "playing") {
      interval = setInterval(() => {
        addWord();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [gameState, addWord]);

  // Check for game over
  useEffect(() => {
    if (gameState === "playing") {
      const gameOver = Object.values(towers).some((tower) => tower.length >= 40);
      if (gameOver) {
        setGameState("gameover");
      }
    }
  }, [towers, gameState]);

  // Handle input
  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value.endsWith(" ")) {
      const word = value.trim();
      Object.entries(towers).forEach(([color, words]) => {
        const index = words.indexOf(word);
        if (index !== -1) {
          setTowers((prev) => ({
            ...prev,
            [color]: prev[color].filter((_, i) => i !== index),
          }));
          setScore((prev) => prev + 100);
        }
      });
      setInput("");
    }
  };

  // Start game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTowers({ red: [], green: [], blue: [] });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Math Teaser Game</h1>
          <div className="text-xl font-semibold">Score: {score}</div>
        </header>

        {gameState === "idle" && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Welcome to Math Teaser Game!</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={startGame}>Start Game</Button>
            </CardContent>
          </Card>
        )}

        {gameState === "playing" && (
          <>
            <div className="flex space-x-4 mb-4">
              {Object.entries(towers).map(([color, words]) => (
                <Tower key={color} color={color} words={words} />
              ))}
            </div>
            <Input
              type="text"
              value={input}
              onChange={handleInput}
              placeholder="Type a word and press space..."
              className="w-full mb-4"
            />
          </>
        )}

        {gameState === "gameover" && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Game Over!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>One of the towers reached 40 words.</p>
              <p>Your final score: {score}</p>
              <Button onClick={startGame} className="mt-4">
                Restart Game
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}