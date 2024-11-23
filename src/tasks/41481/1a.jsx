import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WORDS = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon'];

function Tower({ color, words, onWordRemove, wordCount, onWordLand }) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to add a word
        const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        onWordLand(newWord);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`flex-1 m-2 bg-${color}-100`}>
      <CardHeader>
        <CardTitle>{color.charAt(0).toUpperCase() + color.slice(1)} Tower</CardTitle>
        <p className="text-sm">Words: {wordCount}</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {words.map((word, index) => (
          <div key={index} className="mb-1 animate-[drop_0.5s_ease-in-out]">{word}</div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [towers, setTowers] = useState({
    red: [], green: [], blue: []
  });
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleWordLand = (color, word) => {
    if (towers[color].length < 40) {
      setTowers(prev => ({...prev, [color]: [...prev[color], word]}));
    } else {
      setGameOver(`The ${color} tower reached 40 words!`);
    }
  };

  const checkWord = () => {
    let found = false;
    for (let color in towers) {
      if (towers[color].includes(input)) {
        setTowers(prev => ({
          ...prev, 
          [color]: prev[color].filter(word => word !== input)
        }));
        setScore(prevScore => prevScore + 100);
        found = true;
        break;
      }
    }
    if (!found) {
      // Here you might want to penalize the player or just ignore
    }
    setInput('');
  };

  const startGame = () => {
    setTowers({red: [], green: [], blue: []});
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === ' ' && input.trim()) {
      checkWord();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Math Teaser Game</h1>
      {gameOver && <p className="text-red-500 text-xl mb-4">{gameOver}</p>}
      {!gameStarted ? 
        <Button onClick={startGame}>Start Game</Button> :
        <>
          <div className="text-right w-full mb-4">
            <p>Score: {score}</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full max-w-3xl">
            {['red', 'green', 'blue'].map(color => (
              <Tower 
                key={color} 
                color={color} 
                words={towers[color]} 
                wordCount={towers[color].length}
                onWordRemove={() => {}} 
                onWordLand={(word) => handleWordLand(color, word)} 
              />
            ))}
          </div>
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value.toLowerCase())} 
            onKeyPress={handleKeyPress}
            placeholder="Type a word and press space" 
            className="mt-4 p-2 border border-gray-300 rounded w-full max-w-lg"
          />
        </>
      }
    </div>
  );
}