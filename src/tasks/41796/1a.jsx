import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ParkingSlot = ({ id, car, checkInTime, onCheckOut }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (car && checkInTime) {
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - checkInTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [car, checkInTime]);

  return (
    <Card className={`h-24 ${car ? "bg-blue-100" : "bg-green-100"}`}>
      <CardContent className="p-2 relative">
        <div className="text-xs">{id}</div>
        {car && (
          <>
            <div className="text-sm mt-2">{car}</div>
            <div className="absolute top-1 right-1 text-xs">{timer}s</div>
            <Button
              className="absolute bottom-1 right-1 text-xs p-1"
              onClick={() => onCheckOut(id)}
            >
              Check Out
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const CollectionSummary = ({ collections }) => {
  const total = collections.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Daily Collection Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {collections.map((item, index) => (
            <li key={index}>
              {item.date} - {item.carNumber} - ${item.amount}
            </li>
          ))}
        </ul>
        <div className="mt-4 font-bold">Total: ${total}</div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [carNumber, setCarNumber] = useState("");
  const [parkingSlots, setParkingSlots] = useState(Array(25).fill(null));
  const [collections, setCollections] = useState([]);

  const handleCheckIn = () => {
    if (carNumber.length !== 3) {
      alert("Car number must be 3 digits");
      return;
    }

    const prefixedCarNumber = `abx${carNumber}`;
    const availableSlot = parkingSlots.findIndex((slot) => slot === null);

    if (availableSlot === -1) {
      alert("No parking slots available");
      return;
    }

    const newParkingSlots = [...parkingSlots];
    newParkingSlots[availableSlot] = {
      carNumber: prefixedCarNumber,
      checkInTime: Date.now(),
    };
    setParkingSlots(newParkingSlots);
    setCarNumber("");
  };

  const handleCheckOut = (slotId) => {
    const slot = parkingSlots[slotId];
    const parkingDuration = Math.floor((Date.now() - slot.checkInTime) / 60000);
    const charge = Math.max(50, 50 * (parkingDuration + 1));

    const newCollections = [
      ...collections,
      {
        date: new Date().toLocaleDateString(),
        carNumber: slot.carNumber,
        amount: charge,
      },
    ];
    setCollections(newCollections);

    const newParkingSlots = [...parkingSlots];
    newParkingSlots[slotId] = null;
    setParkingSlots(newParkingSlots);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Parking App</h1>
      <div className="mb-4">
        <Label htmlFor="carNumber">Car Registration Number</Label>
        <div className="flex">
          <Input
            id="carNumber"
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
            maxLength={3}
            className="mr-2"
          />
          <Button onClick={handleCheckIn}>Check In</Button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {parkingSlots.map((slot, index) => (
          <ParkingSlot
            key={index}
            id={index + 1}
            car={slot?.carNumber}
            checkInTime={slot?.checkInTime}
            onCheckOut={handleCheckOut}
          />
        ))}
      </div>
      <CollectionSummary collections={collections} />
    </div>
  );
}