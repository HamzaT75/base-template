import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Utility function to generate random number
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function App() {
  const [rows, setRows] = useState(4);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(15);
  const [answerTimer, setAnswerTimer] = useState(40);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Initialize grid and user answers
  useEffect(() => {
    const newGrid = Array(rows).fill().map(() => ({
      col1: getRandomNumber(2, 50),
      col2: getRandomNumber(2, 50),
      col4: getRandomNumber(1001, 9999),
      col5: getRandomNumber(1001, 9999),
    }));
    setGrid(newGrid);
    setUserAnswers(Array(rows).fill().map(() => ({ col3: "", col6: "" })));
  }, [rows]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (gameStarted && timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && answerTimer > 0) {
      interval = setInterval(() => setAnswerTimer(answerTimer - 1), 1000);
    } else if (answerTimer === 0) {
      clearInterval(interval);
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameStarted, timer, answerTimer]);

  const startGame = () => {
    setGameStarted(true);
    setTimer(15);
    setAnswerTimer(40);
    setScore(0);
    setGameEnded(false);
    setCorrectCount(0);
  };

  const endGame = () => {
    setGameEnded(true);
    calculateScore();
  };

  const calculateScore = () => {
    let correct = 0;
    grid.forEach((row, index) => {
      if (row.col1 * row.col2 === parseInt(userAnswers[index].col3)) {
        setScore((prev) => prev + 50);
        correct++;
      } else {
        setScore((prev) => prev - 5);
      }
      if (row.col4 + row.col5 === parseInt(userAnswers[index].col6)) {
        setScore((prev) => prev + 50);
        correct++;
      } else {
        setScore((prev) => prev - 5);
      }
    });
    setCorrectCount(correct);
  };

  const handleAnswerChange = (rowIndex, col, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[rowIndex][col] = value;
    setUserAnswers(newAnswers);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">SumProduct Game</h1>
      <div className="flex justify-center items-center mb-4">
        <Select onValueChange={(value) => setRows(parseInt(value))} disabled={gameStarted}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Number of rows" />
          </SelectTrigger>
          <SelectContent>
            {[4, 5, 6, 7, 8, 9, 10].map((num) => (
              <SelectItem key={num} value={num.toString()}>{num} rows</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-center mb-4">
        <Button onClick={startGame} disabled={gameStarted}>Start Game</Button>
      </div>
      {gameStarted && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Score: {score} | {timer > 0 ? `Time: ${timer}s` : `Answer Time: ${answerTimer}s`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {grid.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="bg-blue-100 p-2">{timer > 0 ? row.col1 : ""}</div>
                  <div className="bg-blue-100 p-2">{timer > 0 ? row.col2 : ""}</div>
                  <Input
                    type="number"
                    value={userAnswers[rowIndex].col3}
                    onChange={(e) => handleAnswerChange(rowIndex, "col3", e.target.value)}
                    disabled={timer > 0 || answerTimer === 0}
                  />
                  <div className="bg-green-100 p-2">{timer > 0 ? row.col4 : ""}</div>
                  <div className="bg-green-100 p-2">{timer > 0 ? row.col5 : ""}</div>
                  <Input
                    type="number"
                    value={userAnswers[rowIndex].col6}
                    onChange={(e) => handleAnswerChange(rowIndex, "col6", e.target.value)}
                    disabled={timer > 0 || answerTimer === 0}
                  />
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {gameEnded && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">Game Over!</h2>
          <p>Correct Answers: {correctCount} out of {rows * 2}</p>
          <p>Final Score: {score}</p>
          {correctCount === rows * 2 && <p className="text-green-500 font-bold">Congratulations! You won!</p>}
        </div>
      )}
    </div>
  );
}