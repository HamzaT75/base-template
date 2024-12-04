import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function TimePicker() {
  const [timeFormat, setTimeFormat] = useState('24');
  const [hours, setHours] = useState(14);
  const [minutes, setMinutes] = useState(30);
  const [step, setStep] = useState(5);
  const [isInvalid, setIsInvalid] = useState({ hours: false, minutes: false });

  const defaultTime = { hours: 14, minutes: 30 };

  useEffect(() => {
    // Reset to default time when component mounts
    setHours(defaultTime.hours);
    setMinutes(defaultTime.minutes);
  }, []);

  const toggleFormat = () => setTimeFormat(timeFormat === '24' ? '12' : '24');

  const validateTime = () => {
    const hourValid = timeFormat === '24' ? hours >= 0 && hours < 24 : hours > 0 && hours <= 12;
    const minuteValid = minutes >= 0 && minutes < 60;
    setIsInvalid({ hours: !hourValid, minutes: !minuteValid });
    return hourValid && minuteValid;
  };

  const changeTime = (unit, value) => {
    if (validateTime()) {
      if (unit === 'hours') setHours(value);
      else setMinutes((value + 60) % 60);
    }
  };

  const resetTime = () => {
    setHours(defaultTime.hours);
    setMinutes(defaultTime.minutes);
    setIsInvalid({ hours: false, minutes: false });
  };

  const formatTime = () => {
    let displayHours = hours;
    let period = '';
    if (timeFormat === '12') {
      period = hours >= 12 ? 'PM' : 'AM';
      displayHours = hours % 12 || 12;
    }
    return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${period}`;
  };

  return (
    <Card className="w-full sm:w-96">
      <CardHeader>
        <CardTitle>Time Picker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Format:</Label>
          <Button onClick={toggleFormat} variant="outline">
            {timeFormat === '24' ? '12h' : '24h'}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Hours</Label>
            <Input 
              type="number" 
              value={hours} 
              onChange={(e) => setHours(Number(e.target.value))} 
              onBlur={validateTime}
              className={isInvalid.hours ? 'border-red-500' : ''}
            />
            <div className="flex mt-2">
              <Button onClick={() => changeTime('hours', hours + 1)}>+</Button>
              <Button onClick={() => changeTime('hours', hours - 1)} className="ml-2">-</Button>
            </div>
          </div>
          <div>
            <Label>Minutes</Label>
            <Input 
              type="number" 
              value={minutes} 
              onChange={(e) => setMinutes(Number(e.target.value))} 
              onBlur={validateTime}
              className={isInvalid.minutes ? 'border-red-500' : ''}
            />
            <div className="flex mt-2">
              <Button onClick={() => changeTime('minutes', minutes + step)}>+</Button>
              <Button onClick={() => changeTime('minutes', minutes - step)} className="ml-2">-</Button>
            </div>
          </div>
        </div>
        <Select onValueChange={setStep}>
          <SelectTrigger>
            <SelectValue placeholder="Step"/>
          </SelectTrigger>
          <SelectContent>
            {[1, 5, 10, 15].map(step => (
              <SelectItem key={step} value={String(step)}>{step} min</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={resetTime} className="w-full">Reset</Button>
        <div className="text-center text-lg">
          Selected Time: <span className={!validateTime() ? 'text-red-500' : ''}>{formatTime()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <TimePicker />
    </div>
  );
}