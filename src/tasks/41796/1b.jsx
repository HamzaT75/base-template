import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

function ParkingGrid({ slots, onCheckIn, onCheckOut }) {
  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {Array.from({ length: 25 }, (_, i) => {
        const slot = slots[i] || {};
        return (
          <Card key={i} className={slot.carNumber ? "bg-blue-100" : "bg-green-100"}>
            <CardHeader className="p-2">
              <CardTitle className="text-xs">Slot {i + 1}</CardTitle>
              {slot.startTime && <div className="text-xs text-right">{slot.timer}</div>}
            </CardHeader>
            <CardContent className="p-2 text-center">
              {slot.carNumber || 'Empty'}
            </CardContent>
            <CardFooter className="p-2">
              {!slot.carNumber ? 
                <Button onClick={() => onCheckIn(i)} size="sm">Check In</Button> :
                <Button onClick={() => onCheckOut(i)} size="sm" variant="destructive">Check Out</Button>
              }
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function App() {
  const [slots, setSlots] = useState(Array(25).fill(null));
  const [carNumber, setCarNumber] = useState('');
  const [dailyCollection, setDailyCollection] = useState([]);
  const [totalCollection, setTotalCollection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlots(slots => slots.map(slot => {
        if (slot && slot.startTime) {
          const diff = Math.floor((Date.now() - slot.startTime) / 1000);
          const minutes = Math.max(0, Math.ceil(diff / 60) - 1);
          return { ...slot, timer: `${minutes} min` };
        }
        return slot;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = (slotIndex) => {
    if (carNumber.length === 3) {
      const newCarNumber = `abx${carNumber}`;
      const newSlot = { carNumber: newCarNumber, startTime: Date.now() };
      setSlots(slots => {
        const newSlots = [...slots];
        newSlots[slotIndex] = newSlot;
        return newSlots;
      });
      setCarNumber('');
    }
  };

  const handleCheckOut = (slotIndex) => {
    setSlots(slots => {
      const slot = slots[slotIndex];
      const endTime = Date.now();
      const duration = (endTime - slot.startTime) / 60000; // in minutes
      const charge = duration <= 1 ? 50 : 50 + (Math.ceil(duration) - 1) * 50;

      setDailyCollection(prev => [...prev, {
        date: format(endTime, 'dd/MM/yyyy HH:mm'),
        carNumber: slot.carNumber,
        amount: charge
      }]);
      setTotalCollection(prev => prev + charge);

      const newSlots = [...slots];
      newSlots[slotIndex] = null;
      return newSlots;
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-4">
        <Input 
          type="text" 
          placeholder="Enter car number (3 digits)" 
          value={carNumber}
          onChange={e => setCarNumber(e.target.value.slice(0, 3))}
          className="mb-2"
        />
      </div>
      <ParkingGrid slots={slots} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Daily Collection</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyCollection.map((entry, idx) => (
              <div key={idx} className="flex justify-between border-b pb-1 mb-1">
                <span>{entry.date}</span>
                <span>{entry.carNumber}</span>
                <span>${entry.amount}</span>
              </div>
            ))}
            <div className="mt-2 font-bold flex justify-between">
              <span>Total:</span>
              <span>${totalCollection}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;