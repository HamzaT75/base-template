import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEFAULT_TIME = { hours: 12, minutes: 0, period: "PM" };
const MINUTE_STEPS = [1, 5, 10, 15];

const TimePicker = () => {
  const [time, setTime] = useState(DEFAULT_TIME);
  const [is24Hour, setIs24Hour] = useState(false);
  const [minuteStep, setMinuteStep] = useState(1);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    validateTime();
  }, [time]);

  const validateTime = () => {
    const { hours, minutes } = time;
    const isValid =
      (is24Hour ? hours >= 0 && hours < 24 : hours > 0 && hours <= 12) &&
      minutes >= 0 &&
      minutes < 60;
    setIsValid(isValid);
  };

  const handleTimeChange = (field, value) => {
    setTime((prevTime) => ({
      ...prevTime,
      [field]: parseInt(value, 10) || 0,
    }));
  };

  const incrementTime = (field, increment) => {
    setTime((prevTime) => {
      let newTime = { ...prevTime };
      if (field === "hours") {
        newTime.hours = (newTime.hours + increment + (is24Hour ? 24 : 12)) % (is24Hour ? 24 : 12);
        if (!is24Hour && newTime.hours === 0) newTime.hours = 12;
      } else if (field === "minutes") {
        newTime.minutes = (newTime.minutes + increment) % 60;
      }
      return newTime;
    });
  };

  const togglePeriod = () => {
    setTime((prevTime) => ({
      ...prevTime,
      period: prevTime.period === "AM" ? "PM" : "AM",
    }));
  };

  const resetTime = () => {
    setTime(DEFAULT_TIME);
  };

  const formatTime = () => {
    const { hours, minutes, period } = time;
    const formattedHours = is24Hour
      ? hours.toString().padStart(2, "0")
      : ((hours % 12 || 12) + "").padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return is24Hour
      ? `${formattedHours}:${formattedMinutes}`
      : `${formattedHours}:${formattedMinutes} ${period}`;
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Time Picker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="24-hour-toggle">24-Hour Format</Label>
            <Switch
              id="24-hour-toggle"
              checked={is24Hour}
              onCheckedChange={setIs24Hour}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hours">Hours</Label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => incrementTime("hours", -1)}
                >
                  -
                </Button>
                <Input
                  id="hours"
                  type="number"
                  value={time.hours}
                  onChange={(e) => handleTimeChange("hours", e.target.value)}
                  className={`mx-2 text-center ${!isValid ? "border-red-500" : ""}`}
                  min={is24Hour ? 0 : 1}
                  max={is24Hour ? 23 : 12}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => incrementTime("hours", 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="minutes">Minutes</Label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => incrementTime("minutes", -minuteStep)}
                >
                  -
                </Button>
                <Input
                  id="minutes"
                  type="number"
                  value={time.minutes}
                  onChange={(e) => handleTimeChange("minutes", e.target.value)}
                  className={`mx-2 text-center ${!isValid ? "border-red-500" : ""}`}
                  min={0}
                  max={59}
                  step={minuteStep}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => incrementTime("minutes", minuteStep)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {!is24Hour && (
            <div className="flex items-center justify-center">
              <Button onClick={togglePeriod}>{time.period}</Button>
            </div>
          )}

          <div>
            <Label htmlFor="minute-step">Minute Step</Label>
            <Select
              value={minuteStep.toString()}
              onValueChange={(value) => setMinuteStep(parseInt(value, 10))}
            >
              <SelectTrigger id="minute-step">
                <SelectValue placeholder="Select minute step" />
              </SelectTrigger>
              <SelectContent>
                {MINUTE_STEPS.map((step) => (
                  <SelectItem key={step} value={step.toString()}>
                    {step} minute{step > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">{formatTime()}</p>
          </div>

          <Button onClick={resetTime} className="w-full">
            Reset
          </Button>

          {!isValid && (
            <p className="text-red-500 text-sm">
              Invalid time. Please enter a valid time.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <TimePicker />
    </div>
  );
}