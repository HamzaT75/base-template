import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Sample sentences for the game
const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "Where there's a will, there's a way.",
];

export default function App() {
  const [sentence, setSentence] = useState("");
  const [time, setTime] = useState(15);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [gameState, setGameState] = useState("idle"); // idle, playing, ended
  const [remainingTime, setRemainingTime] = useState(time);

  // Function to start or restart the game
  const startGame = () => {
    setSentence(sentences[Math.floor(Math.random() * sentences.length)]);
    setScore(0);
    setInput("");
    setGameState("playing");
    setRemainingTime(time);
  };

  // Function to handle word submission
  const submitWord = () => {
    if (sentence.toLowerCase().includes(input.toLowerCase())) {
      setScore((prevScore) => prevScore + 50);
    } else {
      setScore((prevScore) => Math.max(0, prevScore - 5));
    }
    setInput("");
  };

  // Effect to handle the timer
  useEffect(() => {
    let timer;
    if (gameState === "playing" && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0 && gameState === "playing") {
      setGameState("ended");
    }
    return () => clearInterval(timer);
  }, [gameState, remainingTime]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Text Typing Hunt Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === "idle" && (
            <div className="space-y-4">
              <RadioGroup
                defaultValue="15"
                onValueChange={(value) => setTime(parseInt(value))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15" id="r1" />
                  <Label htmlFor="r1">15 seconds</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="r2" />
                  <Label htmlFor="r2">30 seconds</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="45" id="r3" />
                  <Label htmlFor="r3">45 seconds</Label>
                </div>
              </RadioGroup>
              <Button onClick={startGame} className="w-full">
                Start Game
              </Button>
            </div>
          )}
          {gameState === "playing" && (
            <div className="space-y-4">
              <p className="text-sm font-medium">{sentence}</p>
              <p className="text-lg font-bold">Time: {remainingTime}s</p>
              <p className="text-lg font-bold">Score: {score}</p>
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a word"
                />
                <Button onClick={submitWord}>Submit</Button>
              </div>
            </div>
          )}
          {gameState === "ended" && (
            <div className="space-y-4">
              <p className="text-xl font-bold text-center">Game Over!</p>
              <p className="text-lg font-medium text-center">
                Final Score: {score}
              </p>
              <Button onClick={startGame} className="w-full">
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}