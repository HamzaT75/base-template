import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const timeZones = Array.from({ length: 9 }, (_, i) => `GMT+${i + 1}`);

const TimeZoneSelector = ({ selectedTimeZones, onToggle }) => (
  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
    {timeZones.map((tz) => (
      <div key={tz} className="flex items-center space-x-2">
        <Checkbox
          id={tz}
          checked={selectedTimeZones.includes(tz)}
          onCheckedChange={() => onToggle(tz)}
        />
        <label htmlFor={tz} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {tz}
        </label>
      </div>
    ))}
  </div>
);

const AvailableTimeSlots = ({ selectedTimeZones }) => {
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (selectedTimeZones.length === 0) {
      setTimeSlots([]);
      return;
    }

    const slots = [];
    for (let hour = 10; hour < 15; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        const startTime = new Date(2023, 0, 1, hour, minute);
        const endTime = new Date(2023, 0, 1, hour + 1, minute);

        const isAvailable = selectedTimeZones.every((tz) => {
          const offset = parseInt(tz.slice(4));
          const localStartTime = new Date(startTime.getTime() + offset * 3600000);
          const localEndTime = new Date(endTime.getTime() + offset * 3600000);
          return localStartTime.getHours() >= 10 && localEndTime.getHours() <= 15;
        });

        if (isAvailable) {
          slots.push({ startTime, endTime });
        }
      }
    }
    setTimeSlots(slots);
  }, [selectedTimeZones]);

  if (timeSlots.length === 0) {
    return <p className="text-center mt-4">No available time slots</p>;
  }

  return (
    <div className="mt-4 space-y-2">
      {timeSlots.map((slot, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">Time Slot {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedTimeZones.map((tz) => {
                const offset = parseInt(tz.slice(4));
                const localStart = new Date(slot.startTime.getTime() + offset * 3600000);
                const localEnd = new Date(slot.endTime.getTime() + offset * 3600000);
                return (
                  <div key={tz} className="text-sm">
                    <strong>{tz}:</strong> {localStart.getHours()}:00 - {localEnd.getHours()}:00
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function App() {
  const [selectedTimeZones, setSelectedTimeZones] = useState([]);

  const handleToggle = (timeZone) => {
    setSelectedTimeZones((prev) =>
      prev.includes(timeZone)
        ? prev.filter((tz) => tz !== timeZone)
        : [...prev, timeZone]
    );
  };

  const handleReset = () => {
    setSelectedTimeZones([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meeting Time Finder</h1>
      <Card>
        <CardHeader>
          <CardTitle>Select Time Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeZoneSelector
            selectedTimeZones={selectedTimeZones}
            onToggle={handleToggle}
          />
          <Button onClick={handleReset} className="mt-4">
            Reset
          </Button>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailableTimeSlots selectedTimeZones={selectedTimeZones} />
        </CardContent>
      </Card>
    </div>
  );
}