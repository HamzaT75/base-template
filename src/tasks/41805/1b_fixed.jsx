import React, { useState, useEffect } from 'react';
// import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SEATS = 100; // Total number of seats in a 10x10 grid

const App = () => {
  const [seats, setSeats] = useState(Array(SEATS).fill({ status: 'Empty', customer: '' }));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [numSeats, setNumSeats] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  // Function to find the next available sequence of seats
  const findAvailableSeats = (n) => {
    for(let i = 0; i <= SEATS - n; i++) {
      if(seats.slice(i, i + n).every(seat => seat.status === 'Empty')) {
        return i;
      }
    }
    return -1; // No seats available
  };

  // Reserve seats for a customer
  const reserveSeats = () => {
    const seatsToReserve = parseInt(numSeats, 10);
    if (seatsToReserve > 0) {
      const startSeat = findAvailableSeats(seatsToReserve);
      if(startSeat !== -1) {
        const updatedSeats = [...seats];
        for(let i = startSeat; i < startSeat + seatsToReserve; i++) {
          updatedSeats[i] = { status: 'Reserved', customer: firstName };
        }
        setSeats(updatedSeats);
        setTotalAmount(totalAmount + 500 * seatsToReserve);
        setFirstName('');
        setLastName('');
        setNumSeats(1);
      } else {
        alert("Not enough seats available!");
      }
    }
  };

  // Check if all seats are reserved
  const isFullHouse = seats.every(seat => seat.status === 'Reserved');

  useEffect(() => {
    if (isFullHouse) {
      alert("Full House! No more seats available.");
    }
  }, [seats, isFullHouse]);

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-6 bg-gray-100 min-h-screen">
      <div className="text-right w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-700">Total: ${totalAmount}</h2>
      </div>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Event Seat Reservation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} disabled={isFullHouse} />
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} disabled={isFullHouse} />
            <Label htmlFor="numSeats">Number of Seats</Label>
            <Input 
              id="numSeats" 
              type="number" 
              min="1" 
              max="100" 
              value={numSeats} 
              onChange={e => setNumSeats(e.target.value)} 
              disabled={isFullHouse} 
            />
            <Button onClick={reserveSeats} disabled={isFullHouse}>Reserve Seats</Button>
            {isFullHouse && <p className="text-red-500 font-bold">Full House</p>}
          </div>
          <div className="grid grid-cols-10 gap-1">
            {seats.map((seat, index) => (
              <div 
                key={index} 
                className={`h-8 w-8 flex items-center justify-center text-xs font-bold rounded ${seat.status === 'Reserved' ? 'bg-green-500 text-white' : 'bg-blue-500'}`}
              >
                {seat.status === 'Reserved' ? seat.customer[0] : index + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;