import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  const [rows, setRows] = useState(4);
  const [grid, setGrid] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isInputPhase, setIsInputPhase] = useState(false);
  const [score, setScore] = useState(0);
  const [correctEntries, setCorrectEntries] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    let timer;
    if (gameActive) {
      if (timeLeft > 0 && !isInputPhase) {
        timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else if (timeLeft === 0 && !isInputPhase) {
        setIsInputPhase(true);
        setTimeLeft(40); // Switch to input phase with 40 seconds
      } else if (timeLeft > 0 && isInputPhase) {
        timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else if (timeLeft === 0 && isInputPhase) {
        finishGame();
      }
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isInputPhase, gameActive]);

  const generateGrid = () => {
    const newGrid = Array(rows).fill().map(() => ({
      num1: Math.floor(Math.random() * 49) + 2,
      num2: Math.floor(Math.random() * 49) + 2,
      product: '',
      num3: Math.floor(Math.random() * 8999) + 1001,
      num4: Math.floor(Math.random() * 8999) + 1001,
      sum: '',
    }));
    setGrid(newGrid);
  };

  const startGame = () => {
    setGameActive(true);
    generateGrid();
    setScore(0);
    setCorrectEntries(0);
  };

  const handleInputChange = (e, rowIndex, type) => {
    const updatedGrid = [...grid];
    updatedGrid[rowIndex][type] = e.target.value;
    setGrid(updatedGrid);
  };

  const finishGame = () => {
    let correct = 0;
    let newScore = 0;
    grid.forEach(row => {
      if (parseInt(row.product) === row.num1 * row.num2) {
        correct++;
        newScore += 50;
      } else if (row.product === '') {
        newScore -= 5;
      }
      if (parseInt(row.sum) === row.num3 + row.num4) {
        correct++;
        newScore += 50;
      } else if (row.sum === '') {
        newScore -= 5;
      }
    });
    setScore(newScore);
    setCorrectEntries(correct);
    setGameActive(false);
  };

  const handleRowChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 4 && value <= 10) setRows(value);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-4xl font-bold">SumProduct Game</h1>
      {!gameActive ? (
        <div className="flex space-x-4">
          <Input 
            type="number" 
            value={rows} 
            onChange={handleRowChange} 
            min="4" max="10" 
            className="w-20"
          />
          <Button onClick={startGame}>Start Game</Button>
        </div>
      ) : (
        <>
          <div className="text-2xl mb-4">Score: {score}</div>
          <div className="text-lg mb-2">Time Left: {timeLeft}s</div>
          <Card>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {grid.map((row, index) => (
                  <React.Fragment key={index}>
                    <div className="bg-blue-100 p-2 text-center">{row.num1}</div>
                    <div className="bg-blue-100 p-2 text-center">{row.num2}</div>
                    <Input 
                      disabled={!isInputPhase} 
                      value={row.product} 
                      onChange={(e) => handleInputChange(e, index, 'product')} 
                      className="text-center"
                    />
                    <div className="bg-green-100 p-2 text-center">{row.num3}</div>
                    <div className="bg-green-100 p-2 text-center">{row.num4}</div>
                    <Input 
                      disabled={!isInputPhase} 
                      value={row.sum} 
                      onChange={(e) => handleInputChange(e, index, 'sum')} 
                      className="text-center"
                    />
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {gameActive && timeLeft === 0 && isInputPhase && (
        <Button onClick={finishGame}>Submit Answers</Button>
      )}
      {!gameActive && correctEntries > 0 && (
        <div>
          <p>Correct Entries: {correctEntries}/{grid.length * 2}</p>
          <p>Final Score: {score}</p>
          {correctEntries === grid.length * 2 && <p className="text-green-500">You won!</p>}
        </div>
      )}
    </div>
  );
}