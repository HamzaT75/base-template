import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const wordsList = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew',
  'Kiwi', 'Lemon', 'Mango', 'Nectarine', 'Orange', 'Papaya', 'Quince', 'Raspberry',
  'Strawberry', 'Tangerine', 'Ugli', 'Vanilla', 'Watermelon', 'Xigua', 'Yam', 'Zucchini'
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function WordGrid({ words, onWordClick, isSelectable }) {
  return (
    <div className="grid grid-cols-5 gap-4 sm:grid-cols-2">
      {words.map((word, index) => (
        <Card key={index} className="cursor-pointer" onClick={() => isSelectable && onWordClick(word)}>
          <CardContent className="p-4 text-center">
            <p>{word}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [gridSize, setGridSize] = useState({ rows: 3, cols: 3 });
  const [displayTime, setDisplayTime] = useState(7);
  const [guessTime, setGuessTime] = useState(7);
  const [words, setWords] = useState([]);
  const [gamePhase, setGamePhase] = useState('setup'); // 'setup', 'display', 'guess', 'end'
  const [selectedWords, setSelectedWords] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);

  const startGame = useCallback(() => {
    const totalCells = gridSize.rows * gridSize.cols;
    const halfWords = Math.floor(totalCells / 2);
    let newWords = shuffle([...wordsList]).slice(0, totalCells);
    setWords(newWords);
    setGamePhase('display');
    setSelectedWords([]);

    // Display words for set time
    setTimeout(() => {
      setWords(currentWords => {
        const toKeep = new Set(shuffle(currentWords).slice(0, halfWords));
        return shuffle([...Array.from(toKeep), ...shuffle(wordsList).slice(0, totalCells - halfWords)]);
      });
      setGamePhase('guess');
    }, displayTime * 1000);

    // End guessing phase
    setTimeout(() => {
      const correct = selectedWords.filter(word => newWords.includes(word)).length;
      setCorrectCount(correct);
      setGamePhase('end');
    }, (displayTime + guessTime) * 1000);
  }, [displayTime, guessTime, gridSize.rows, gridSize.cols, selectedWords]);

  const resetGame = () => {
    setGamePhase('setup');
    setWords([]);
    setCorrectCount(0);
  };

  const handleWordClick = (word) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords(prev => [...prev, word]);
    } else {
      setSelectedWords(prev => prev.filter(w => w !== word));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Word Memory Game</CardTitle>
        </CardHeader>
        <CardContent>
          {gamePhase === 'setup' && (
            <>
              <div className="mb-4">
                <Label>Grid Size (Rows x Columns)</Label>
                <div className="flex gap-2">
                  <Input type="number" min="2" max="5" value={gridSize.rows} onChange={e => setGridSize(prev => ({...prev, rows: e.target.value}))} />
                  <Input type="number" min="2" max="5" value={gridSize.cols} onChange={e => setGridSize(prev => ({...prev, cols: e.target.value}))} />
                </div>
              </div>
              <div className="mb-4">
                <Label>Display Time (1-10 seconds)</Label>
                <Input type="number" min="1" max="10" value={displayTime} onChange={e => setDisplayTime(Number(e.target.value))} />
              </div>
              <div className="mb-4">
                <Label>Guess Time (3-10 seconds)</Label>
                <Input type="number" min="3" max="10" value={guessTime} onChange={e => setGuessTime(Number(e.target.value))} />
              </div>
              <Button onClick={startGame}>Start Game</Button>
            </>
          )}
          {gamePhase !== 'setup' && (
            <>
              <WordGrid words={words} onWordClick={handleWordClick} isSelectable={gamePhase === 'guess'} />
              {gamePhase === 'end' && (
                <div className="mt-4 text-center">
                  {correctCount === Math.floor((gridSize.rows * gridSize.cols) / 2) ? 
                    <p className="text-green-500">You won! You got all words correct!</p> :
                    <p>You got {correctCount} out of {Math.floor((gridSize.rows * gridSize.cols) / 2)} correct.</p>
                  }
                  <Button onClick={resetGame}>Reset Game</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}