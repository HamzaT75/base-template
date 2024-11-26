import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const timeZones = [
  { label: 'GMT+1', offset: 1 },
  { label: 'GMT+2', offset: 2 },
  { label: 'GMT+3', offset: 3 },
  { label: 'GMT+4', offset: 4 },
  { label: 'GMT+5', offset: 5 },
  { label: 'GMT+6', offset: 6 },
  { label: 'GMT+7', offset: 7 },
  { label: 'GMT+8', offset: 8 },
  { label: 'GMT+9', offset: 9 },
];

function TimeSlot({ start, zones }) {
  const timeInZones = zones.map(zone => {
    const localTime = (start + zone.offset) % 24;
    return `${zone.label}: ${localTime < 10 ? '0' : ''}${localTime}:00`;
  });

  return (
    <div className="border-b border-gray-200 p-2">
      {timeInZones.join(' | ')}
    </div>
  );
}

function TimeZoneSelector({ zones, onToggle }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Select Time Zones</CardTitle>
      </CardHeader>
      <CardContent>
        {zones.map(zone => (
          <div key={zone.label} className="flex items-center mb-2">
            <Checkbox 
              id={zone.label} 
              checked={zone.selected} 
              onCheckedChange={() => onToggle(zone.label)} 
            />
            <label htmlFor={zone.label} className="ml-2 text-sm">{zone.label}</label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [selectedZones, setSelectedZones] = useState(
    timeZones.map(z => ({...z, selected: false}))
  );

  const toggleZone = (label) => {
    setSelectedZones(currentZones => 
      currentZones.map(z => z.label === label ? {...z, selected: !z.selected} : z)
    );
  };

  const resetZones = () => {
    setSelectedZones(currentZones => currentZones.map(z => ({...z, selected: false})));
  };

  const availableSlots = () => {
    let slots = [];
    for (let hour = 10; hour < 15; hour++) { // 10am to 2pm
      slots.push(hour);
    }
    return slots;
  };

  const filteredZones = selectedZones.filter(z => z.selected);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <TimeZoneSelector zones={selectedZones} onToggle={toggleZone} />
      <Button onClick={resetZones} className="mb-4">Reset</Button>
      <Card>
        <CardHeader>
          <CardTitle>Available Meeting Times</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredZones.length > 0 ? (
            availableSlots().map(slot => 
              <TimeSlot key={slot} start={slot} zones={filteredZones} />
            )
          ) : (
            <p className="text-center text-gray-500">Select time zones to see available slots.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}