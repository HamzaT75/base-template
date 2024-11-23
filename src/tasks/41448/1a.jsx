import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = ['red', 'yellow', 'blue', 'black'];

const GridCell = ({ color, hidden, onClick, selected }) => (
  <div 
    className={`w-20 h-20 sm:w-24 sm:h-24 m-2 rounded ${hidden ? 'bg-slate-200' : `bg-${color}-500`} ${selected ? 'border-4 border-green-500' : ''}`} 
    onClick={onClick}
  >
    {hidden && selected && <div className="text-green-500 text-2xl flex justify-center items-center h-full">✓</div>}
  </div>
);

export default function App() {
  const [grid, setGrid] = useState([]);
  const [viewTime, setViewTime] = useState(5);
  const [selectTime, setSelectTime] = useState(10);
  const [isViewing, setIsViewing] = useState(true);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedColors, setSelectedColors] = useState([]);
  const [userSelection, setUserSelection] = useState(Array(9).fill(false));

  // Initialize grid with random colors
  const initializeGrid = () => {
    setGrid(Array.from({length: 9}, () => colors[Math.floor(Math.random() * colors.length)]));
  };

  useEffect(() => {
    if (gameActive) {
      const timer = setInterval(() => {
        if (isViewing) {
          setViewTime(t => t > 0 ? t - 1 : t);
          if (viewTime === 1) {
            setIsViewing(false);
          }
        } else {
          setSelectTime(t => t > 0 ? t - 1 : t);
          if (selectTime === 0) {
            evaluateScore();
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameActive, isViewing, viewTime, selectTime]);

  useEffect(initializeGrid, [gameActive]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setUserSelection(Array(9).fill(false));
    setSelectedColors([colors[Math.floor(Math.random() * colors.length)], colors[Math.floor(Math.random() * colors.length)]]);
  };

  const handleCellClick = (index) => {
    if (!isViewing && selectTime > 0) {
      const newSelection = [...userSelection];
      newSelection[index] = !newSelection[index];
      setUserSelection(newSelection);
    }
  };

  const evaluateScore = () => {
    let correct = 0, incorrect = 0, deduction = 1;
    grid.forEach((color, index) => {
      if (selectedColors.includes(color)) {
        if (userSelection[index]) correct++;
        else correct--;
      } else if (userSelection[index]) {
        incorrect++;
        setScore(prev => prev - deduction);
        deduction *= 2; // Increase deduction for each wrong selection
      }
    });
    setScore(prev => prev + correct * 5);
    setGameActive(false);
  };

  const gridDisplay = grid.map((color, index) => 
    <GridCell 
      key={index} 
      color={color} 
      hidden={!isViewing} 
      onClick={() => handleCellClick(index)} 
      selected={userSelection[index]}
    />
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-4 sm:p-6">
        <CardHeader>
          <CardTitle>Color Matching Game</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {gameActive ? (
            <>
              <div className="flex justify-end text-lg mb-4">
                {isViewing ? `View: ${viewTime}s` : `Select: ${selectTime}s`}
              </div>
              <div className="flex flex-wrap justify-center">
                {gridDisplay}
              </div>
              {!isViewing && (
                <p className="mt-4">Select all cells that had the {selectedColors.join(' and ')} color.</p>
              )}
            </>
          ) : (
            <>
              <p>Score: {score}</p>
              <Button onClick={startGame} className="mt-4">Start Game</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}