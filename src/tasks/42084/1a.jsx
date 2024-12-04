import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

function App() {
  const [workTime, setWorkTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [sessionsBeforeLong, setSessionsBeforeLong] = useState(4);
  const [currentSession, setCurrentSession] = useState('Work');
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            switchSession();
            return 0;
          }
          setProgress(1 - (prevTime / (currentSession === 'Work' ? workTime : currentSession === 'Short Break' ? shortBreak : longBreak) / 60));
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, workTime, shortBreak, longBreak, currentSession]);

  const switchSession = () => {
    const sessionsCount = sessionsBeforeLong - 1;
    if (currentSession === 'Work') {
      if (sessionsCount === 0) {
        setCurrentSession('Long Break');
        setTimeLeft(longBreak * 60);
        setSessionsBeforeLong(4);
      } else {
        setCurrentSession('Short Break');
        setTimeLeft(shortBreak * 60);
        setSessionsBeforeLong(sessionsCount);
      }
    } else {
      setCurrentSession('Work');
      setTimeLeft(workTime * 60);
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft((currentSession === 'Work' ? workTime : currentSession === 'Short Break' ? shortBreak : longBreak) * 60);
    setProgress(0);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-md p-4 sm:p-6">
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{currentSession}</div>
            <div className="text-lg text-muted-foreground">
              Time Remaining: {formatTime(timeLeft)}
            </div>
            <div className="relative h-4 mt-4 bg-slate-300 rounded-full">
              <div 
                style={{ width: `${progress * 100}%` }} 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              ></div>
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={isRunning ? pauseTimer : startTimer}>
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetTimer}>Reset</Button>
          </div>
          <div className="space-y-2">
            <Label>Work Time (min)</Label>
            <Input 
              type="number" 
              value={workTime} 
              onChange={e => setWorkTime(Number(e.target.value))} 
              disabled={isRunning}
            />
            <Label>Short Break (min)</Label>
            <Input 
              type="number" 
              value={shortBreak} 
              onChange={e => setShortBreak(Number(e.target.value))} 
              disabled={isRunning}
            />
            <Label>Long Break (min)</Label>
            <Input 
              type="number" 
              value={longBreak} 
              onChange={e => setLongBreak(Number(e.target.value))} 
              disabled={isRunning}
            />
            <Label>Sessions before Long Break</Label>
            <Slider 
              value={[sessionsBeforeLong]} 
              onValueChange={([value]) => setSessionsBeforeLong(value)} 
              max={8} 
              step={1} 
              disabled={isRunning}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;