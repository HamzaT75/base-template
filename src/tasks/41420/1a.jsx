import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Main App component
export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Game />
    </div>
  );
}

// Game component that contains all game logic
function Game() {
  const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question."
  ];
  const [sentence, setSentence] = useState(sentences[0]);
  const [time, setTime] = useState(15);
  const [remainingTime, setRemainingTime] = useState(15);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const timerRef = useRef(null);

  // Function to start or restart the game
  const startGame = () => {
    setSentence(sentences[Math.floor(Math.random() * sentences.length)]);
    setRemainingTime(time);
    setScore(0);
    setGameActive(true);
    timerRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime > 0) return prevTime - 1;
        clearInterval(timerRef.current);
        setGameActive(false);
        return 0;
      });
    }, 1000);
  };

  // Handle word submission
  const handleSubmit = () => {
    const words = sentence.toLowerCase().split(' ');
    const inputWord = userInput.trim().toLowerCase();
    if (words.includes(inputWord)) {
      setScore(prevScore => prevScore + 50);
    } else {
      setScore(prevScore => prevScore - 5);
    }
    setUserInput('');
  };

  // Cleanup for the timer
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Typing Hunt Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!gameActive ? (
          <>
            <Label>Select Game Time</Label>
            <RadioGroup defaultValue="15" onValueChange={setTime} className="flex flex-col space-y-2">
              <RadioGroupItem value="15" id="r15">15 Seconds</RadioGroupItem>
              <RadioGroupItem value="30" id="r30">30 Seconds</RadioGroupItem>
              <RadioGroupItem value="45" id="r45">45 Seconds</RadioGroupItem>
            </RadioGroup>
            <Button onClick={startGame}>Start Game</Button>
          </>
        ) : (
          <>
            <div className="text-xs mb-2">Time Left: {remainingTime}s</div>
            <div className="text-2xl mb-4" style={{ fontSize: '12px' }}>{sentence}</div>
            <Input 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              placeholder="Type a word from the sentence"
              className="mb-2"
            />
            <Button onClick={handleSubmit} disabled={!userInput}>Submit</Button>
            <div className="mt-4">Score: {score}</div>
          </>
        )}
        {remainingTime === 0 && (
          <div className="text-center mt-4">Game Over! Your score is {score}.</div>
        )}
      </CardContent>
    </Card>
  );
}