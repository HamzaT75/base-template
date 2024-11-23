import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const words = [
  "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon"
];

function ScrollingText({ words, onWordExit, onCorrectWord }) {
  const [position, setPosition] = useState(0);
  const speedRef = useRef(15); // Start speed in words per minute

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => prev - 1); // Move text to left
      const firstWord = words[0];
      if (-position > firstWord.length * 6) { // Assuming each character is roughly 6px wide
        onWordExit(firstWord);
        onCorrectWord(firstWord); // Here, we simulate removal as if it was typed correctly for animation
      }
    }, 60000 / (speedRef.current * 100)); // Convert words per minute to ms per pixel

    return () => clearInterval(interval);
  }, [words, position, onWordExit, onCorrectWord]);

  useEffect(() => {
    const speedInterval = setInterval(() => {
      if (speedRef.current < 50) {
        speedRef.current += 1; // Increase speed by 1 word per minute every 10 seconds
      }
    }, 10000);
    return () => clearInterval(speedInterval);
  }, []);

  return (
    <div className="w-full bg-slate-800 text-white overflow-hidden" style={{fontSize: '12px'}}>
      <div style={{ transform: `translateX(${position}px)`, whiteSpace: 'nowrap' }}>
        {words.join(' ')}
      </div>
    </div>
  );
}

export default function App() {
  const [gameWords, setGameWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const gameInterval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        if (score <= 0) {
          setIsPlaying(false);
          clearInterval(gameInterval);
        }
      }, 1000);

      return () => clearInterval(gameInterval);
    }
  }, [isPlaying, score]);

  const startGame = () => {
    setGameWords(words.slice().sort(() => Math.random() - 0.5).slice(0, 20)); // Randomize and limit words
    setInputValue('');
    setScore(50);
    setIsPlaying(true);
    setTimeElapsed(0);
  };

  const handleWordExit = (word) => {
    if (!inputValue.includes(word)) {
      setScore(prev => prev - 5);
    }
  };

  const handleCorrectWord = (word) => {
    setGameWords(prev => prev.filter(w => w !== word));
    setScore(prev => prev + 10);
  };

  const onInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const lastWord = value.trim().split(' ').pop();
    if (gameWords.includes(lastWord)) {
      handleCorrectWord(lastWord);
      setInputValue(value.replace(new RegExp(lastWord + '$'), ''));
    }
  };

  const onBackspace = () => {
    setScore(prev => prev - 1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mb-4 text-center">
        <Button onClick={startGame} disabled={isPlaying}>Start Game</Button>
        <div className="mt-2 text-lg">Score: {score}</div>
      </div>
      {isPlaying && (
        <>
          <ScrollingText 
            words={gameWords} 
            onWordExit={handleWordExit}
            onCorrectWord={handleCorrectWord}
          />
          <div className="mt-auto">
            <Input 
              value={inputValue} 
              onChange={onInputChange}
              onKeyDown={(e) => e.key === 'Backspace' && onBackspace()}
              placeholder="Type the words here..." 
              className="w-full mb-4"
            />
          </div>
        </>
      )}
    </div>
  );
}