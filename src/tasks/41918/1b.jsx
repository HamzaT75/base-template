import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const questions = [
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Japan", "Korea", "Vietnam"],
    correct: "Japan"
  },
  {
    question: "What is the capital of Brazil?",
    options: ["Rio de Janeiro", "São Paulo", "Brasília", "Buenos Aires"],
    correct: "Brasília"
  },
  // Add three more questions here
];

function QuestionCard({ question, index, selectAnswer, timeLeft, onTimeUp }) {
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(timeLeft);

  useEffect(() => {
    let timer;
    if (selected === null && time > 0) {
      timer = setTimeout(() => setTime(time - 1), 1000);
    } else if (time === 0 && selected === null) {
      onTimeUp();
    }
    return () => clearTimeout(timer);
  }, [time, selected, onTimeUp]);

  const handleSelect = (option) => {
    if (selected === null) {
      setSelected(option);
      selectAnswer(index, option, timeLeft - time);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
        <CardDescription>Time Left: {time}s</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((opt, idx) => (
            <Button 
              key={idx} 
              variant={selected === opt ? (opt === question.correct ? 'success' : 'destructive') : 'outline'}
              onClick={() => handleSelect(opt)}
              disabled={selected !== null}
            >
              {opt}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Results({ scores, times }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        {scores.map((score, idx) => (
          <div key={idx} className="mb-2">
            Question {idx + 1}: {score ? 'Correct' : 'Incorrect'} - Score: {score} - Time: {times[idx]}s
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState(Array(questions.length).fill(0));
  const [times, setTimes] = useState(Array(questions.length).fill(0));
  const [quizEnded, setQuizEnded] = useState(false);

  const selectAnswer = (questionIndex, answer, timeTaken) => {
    setScores(prev => {
      let newScores = [...prev];
      newScores[questionIndex] = answer === questions[questionIndex].correct ? 100 : 0;
      return newScores;
    });
    setTimes(prev => {
      let newTimes = [...prev];
      newTimes[questionIndex] = timeTaken;
      return newTimes;
    });
    if (questionIndex < questions.length - 1) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const handleTimeUp = () => {
    if (!quizEnded) {
      selectAnswer(currentQuestion, null, 0);
    }
  };

  const endQuiz = () => {
    setQuizEnded(true);
  };

  return (
    <div className="container mx-auto p-4">
      {!quizEnded ? (
        <>
          <QuestionCard 
            question={questions[currentQuestion]} 
            index={currentQuestion} 
            selectAnswer={selectAnswer}
            timeLeft={10} 
            onTimeUp={handleTimeUp}
          />
          <Button onClick={endQuiz} className="mt-4 w-full sm:w-auto">Submit Quiz</Button>
        </>
      ) : (
        <Results scores={scores} times={times} />
      )}
    </div>
  );
}