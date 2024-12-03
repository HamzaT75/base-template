import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

function ProgressBar({ color, percentage }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-6">
      <div 
        className={`h-full text-center text-xs text-white bg-${color}-500 rounded-full transition-all duration-500 ease-out`} 
        style={{ width: `${percentage}%` }}
      >
        {percentage}%
      </div>
    </div>
  );
}

function ColorSelector({ colors, selectedColor, onSelect }) {
  return (
    <div className="flex space-x-2 mt-4">
      {colors.map(color => (
        <div 
          key={color} 
          className={`w-6 h-6 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        ></div>
      ))}
    </div>
  );
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [color, setColor] = useState('blue');
  const intervalRef = useRef(null);
  const colors = ['blue', 'red', 'green', 'yellow', 'purple'];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 100) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 100;
          }
          return prevProgress + (100 / (10000 / speed)); // Adjust based on speed
        });
      }, speed);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, speed]);

  const startProgress = () => {
    if (progress >= 100) setProgress(0);
    setIsRunning(true);
  };

  const resetProgress = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const pauseResume = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Smart Progress Bar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar color={color} percentage={progress} />
          <div className="flex justify-between items-center">
            <Button onClick={startProgress} disabled={isRunning && progress < 100}>Start</Button>
            <Button onClick={resetProgress}>Reset</Button>
            <Switch checked={isRunning} onCheckedChange={pauseResume} />
          </div>
          <Slider 
            defaultValue={[50]} 
            max={100} 
            step={10} 
            onValueChange={(value) => setSpeed(value[0])} 
            className="w-full"
          />
          <p className="text-center text-sm">Speed: {speed}</p>
          <ColorSelector colors={colors} selectedColor={color} onSelect={setColor} />
        </CardContent>
      </Card>
    </div>
  );
}