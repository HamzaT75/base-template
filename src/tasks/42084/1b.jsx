import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SESSION_TYPES = {
  WORK: "Work Time",
  SHORT_BREAK: "Short Break",
  LONG_BREAK: "Long Break",
};

export default function App() {
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  });
  const [currentSession, setCurrentSession] = useState(SESSION_TYPES.WORK);
  const [timeRemaining, setTimeRemaining] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSessionEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);

  const handleSessionEnd = () => {
    setIsRunning(false);
    if (currentSession === SESSION_TYPES.WORK) {
      setSessionCount((prevCount) => prevCount + 1);
      if (sessionCount + 1 >= settings.sessionsBeforeLongBreak) {
        setCurrentSession(SESSION_TYPES.LONG_BREAK);
        setTimeRemaining(settings.longBreakDuration * 60);
        setSessionCount(0);
      } else {
        setCurrentSession(SESSION_TYPES.SHORT_BREAK);
        setTimeRemaining(settings.shortBreakDuration * 60);
      }
    } else {
      setCurrentSession(SESSION_TYPES.WORK);
      setTimeRemaining(settings.workDuration * 60);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    const totalTime =
      currentSession === SESSION_TYPES.WORK
        ? settings.workDuration * 60
        : currentSession === SESSION_TYPES.SHORT_BREAK
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Pomodoro Timer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold">{currentSession}</h2>
            <p className="text-3xl font-bold mt-2">
              {formatTime(timeRemaining)}
            </p>
          </div>
          <div className="relative pt-1 mb-6">
            <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${calculateProgress()}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              ></div>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={() => setIsRunning((prev) => !prev)}
              className="px-6 py-2"
            >
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button
              onClick={() => {
                setIsRunning(false);
                setTimeRemaining(
                  currentSession === SESSION_TYPES.WORK
                    ? settings.workDuration * 60
                    : currentSession === SESSION_TYPES.SHORT_BREAK
                    ? settings.shortBreakDuration * 60
                    : settings.longBreakDuration * 60
                );
              }}
              className="px-6 py-2"
            >
              Reset
            </Button>
          </div>
          <SettingsDialog settings={settings} setSettings={setSettings} />
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsDialog({ settings, setSettings }) {
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = () => {
    setSettings(tempSettings);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="workDuration" className="text-right">
              Work (min):
            </label>
            <Input
              id="workDuration"
              type="number"
              value={tempSettings.workDuration}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  workDuration: parseInt(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="shortBreakDuration" className="text-right">
              Short Break (min):
            </label>
            <Input
              id="shortBreakDuration"
              type="number"
              value={tempSettings.shortBreakDuration}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  shortBreakDuration: parseInt(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="longBreakDuration" className="text-right">
              Long Break (min):
            </label>
            <Input
              id="longBreakDuration"
              type="number"
              value={tempSettings.longBreakDuration}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  longBreakDuration: parseInt(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="sessionsBeforeLongBreak" className="text-right">
              Sessions before long break:
            </label>
            <Slider
              id="sessionsBeforeLongBreak"
              min={1}
              max={10}
              step={1}
              value={[tempSettings.sessionsBeforeLongBreak]}
              onValueChange={(value) =>
                setTempSettings({
                  ...tempSettings,
                  sessionsBeforeLongBreak: value[0],
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
}