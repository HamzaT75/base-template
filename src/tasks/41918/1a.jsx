import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const quizData = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "Which river is the longest in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctAnswer: "Nile",
  },
  {
    question: "What is the largest country by land area?",
    options: ["China", "USA", "Canada", "Russia"],
    correctAnswer: "Russia",
  },
  {
    question: "Which continent is the least populated?",
    options: ["Europe", "Australia", "Antarctica", "South America"],
    correctAnswer: "Antarctica",
  },
  {
    question: "What is the highest mountain in the world?",
    options: ["K2", "Kilimanjaro", "Mount Everest", "Mont Blanc"],
    correctAnswer: "Mount Everest",
  },
];

function QuestionCard({ question, options, onAnswer, timer }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={onAnswer}>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="text-sm font-medium">Time: {timer}s</div>
      </CardFooter>
    </Card>
  );
}

function ResultCard({ results }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        {results.map((result, index) => (
          <div key={index} className="mb-2">
            <p>Question {index + 1}: Score {result.score}, Time {result.time}s</p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p className="font-bold">
          Total Score: {results.reduce((sum, result) => sum + result.score, 0)}
        </p>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [results, setResults] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    if (currentQuestion < quizData.length && !quizEnded) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentQuestion, quizEnded]);

  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === quizData[currentQuestion].correctAnswer;
    const questionScore = isCorrect ? 100 : 0;
    setScore(score + questionScore);

    setResults([...results, { score: questionScore, time: timer }]);

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(0);
    } else {
      setQuizEnded(true);
    }
  };

  const handleSubmit = () => {
    setQuizEnded(true);
  };

  if (quizEnded) {
    return <ResultCard results={results} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Geography Quiz</h1>
      <QuestionCard
        question={quizData[currentQuestion].question}
        options={quizData[currentQuestion].options}
        onAnswer={handleAnswer}
        timer={timer}
      />
      <Button onClick={handleSubmit} className="mt-4">
        Submit Quiz
      </Button>
    </div>
  );
}