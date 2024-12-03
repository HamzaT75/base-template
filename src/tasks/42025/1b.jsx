import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colorOptions = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-purple-500",
];

function ProgressBar({ progress, color }) {
  return (
    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300 ease-out flex items-center justify-center text-white text-sm font-bold`}
        style={{ width: `${progress}%` }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
}

function ColorSelector({ selectedColor, onColorSelect }) {
  return (
    <div className="flex space-x-2 mt-4">
      {colorOptions.map((color) => (
        <button
          key={color}
          className={`w-8 h-8 rounded-full ${color} ${
            selectedColor === color ? "ring-2 ring-offset-2 ring-black" : ""
          }`}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [color, setColor] = useState(colorOptions[0]);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(null);

  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    const elapsed = timestamp - startTimeRef.current;
    const newProgress = Math.min((elapsed / (20000 / speed)) * 100, 100);
    setProgress(newProgress);

    if (newProgress < 100) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startAnimation = () => {
    setIsRunning(true);
    startTimeRef.current = null;
    pausedTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);
  };

  const pauseAnimation = () => {
    setIsRunning(false);
    cancelAnimationFrame(animationRef.current);
    pausedTimeRef.current = performance.now();
  };

  const resumeAnimation = () => {
    setIsRunning(true);
    if (pausedTimeRef.current) {
      startTimeRef.current += performance.now() - pausedTimeRef.current;
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  const resetAnimation = () => {
    setIsRunning(false);
    setProgress(0);
    cancelAnimationFrame(animationRef.current);
    startTimeRef.current = null;
    pausedTimeRef.current = null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Smart Progress Bar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar progress={progress} color={color} />
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Speed:</span>
            <Slider
              className="w-2/3"
              min={1}
              max={10}
              step={1}
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
            />
            <span className="text-sm font-medium">{speed}x</span>
          </div>
          <div className="flex space-x-2">
            {!isRunning && progress === 0 && (
              <Button onClick={startAnimation} className="flex-1">
                Start
              </Button>
            )}
            {isRunning && (
              <Button onClick={pauseAnimation} className="flex-1">
                Pause
              </Button>
            )}
            {!isRunning && progress > 0 && progress < 100 && (
              <Button onClick={resumeAnimation} className="flex-1">
                Resume
              </Button>
            )}
            <Button onClick={resetAnimation} className="flex-1">
              Reset
            </Button>
          </div>
          <ColorSelector selectedColor={color} onColorSelect={setColor} />
        </CardContent>
      </Card>
    </div>
  );
}