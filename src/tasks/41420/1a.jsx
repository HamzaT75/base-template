import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

// Array of words for the game
const words = [
  "react", "tailwind", "shadcn", "javascript", "typescript",
  "component", "hook", "state", "effect", "render",
  "function", "array", "object", "string", "number",
  "boolean", "null", "undefined", "promise", "async",
  "await", "fetch", "api", "dom", "virtual",
  "jsx", "css", "html", "module", "import",
  "export", "default", "const", "let", "var",
  "if", "else", "switch", "for", "while",
  "map", "filter", "reduce", "find", "some",
  "every", "includes", "push", "pop", "shift"
];

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(50);
  const [scrollingWords, setScrollingWords] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [speed, setSpeed] = useState(15);
  const [currentSpeed, setCurrentSpeed] = useState(15);
  const scrollRef = useRef(null);

  // Start or restart the game
  const startGame = () => {
    setGameStarted(true);
    setScore(50);
    setScrollingWords(shuffleArray(words).slice(0, 20));
    setUserInput("");
    setCurrentSpeed(15);
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Handle user input
  const handleInput = (e) => {
    const input = e.target.value;
    setUserInput(input);

    // Check if the input matches any word in the scrolling text
    const matchedWordIndex = scrollingWords.findIndex(word => word.startsWith(input));
    if (matchedWordIndex !== -1 && scrollingWords[matchedWordIndex] === input) {
      setScore(prevScore => prevScore + 10);
      setScrollingWords(prevWords => prevWords.filter((_, index) => index !== matchedWordIndex));
      setUserInput("");
    }
  };

  // Handle backspace
  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      setScore(prevScore => Math.max(0, prevScore - 1));
    }
  };

  // Update scrolling text position
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
          scrollRef.current.scrollLeft = 0;
          setScore(prevScore => Math.max(0, prevScore - 5));
          setScrollingWords(prevWords => prevWords.slice(1));
        }
      }
    }, 1000 / (currentSpeed * 5)); // Adjust speed

    return () => clearInterval(interval);
  }, [gameStarted, currentSpeed]);

  // Increase speed over time
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setCurrentSpeed(prevSpeed => Math.min(50, prevSpeed + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [gameStarted]);

  // End game when score reaches zero
  useEffect(() => {
    if (score === 0) {
      setGameStarted(false);
    }
  }, [score]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Word Typing Hunt</h1>
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold">Score: {score}</div>
          <Button onClick={startGame}>{gameStarted ? "Restart" : "Start"} Game</Button>
        </div>
        <div className="mb-4 flex items-center">
          <span className="mr-2">Speed: {speed} wpm</span>
          <Slider
            min={10}
            max={50}
            step={1}
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            className="w-48"
          />
        </div>
        <div
          ref={scrollRef}
          className="w-full h-16 bg-gray-800 text-white overflow-x-hidden whitespace-nowrap mb-4"
        >
          <div className="inline-block animate-scroll">
            {scrollingWords.map((word, index) => (
              <span key={index} className="mr-4 text-xs">
                {word}
              </span>
            ))}
          </div>
        </div>
        <Input
          type="text"
          value={userInput}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type the words here..."
          className="w-full"
          disabled={!gameStarted}
        />
      </div>
    </div>
  );
}