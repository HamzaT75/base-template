import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function App() {
  const [rooms, setRooms] = useState(() => Array(20).fill({ status: 'Available' }));
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', id: '' });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [duration, setDuration] = useState(0);
  const [checkInTime, setCheckInTime] = useState(null);
  const [revenue, setRevenue] = useState([]);

  const handleCheckIn = () => {
    if (selectedRoom !== null && customer.firstName && customer.lastName && customer.id && duration > 0) {
      const newRooms = [...rooms];
      newRooms[selectedRoom] = {
        ...newRooms[selectedRoom],
        status: 'Occupied',
        customer: customer,
        duration: duration,
        checkInTime: new Date().getTime(),
      };
      setRooms(newRooms);
      setCheckInTime(new Date().getTime());
    }
  };

  const handleCheckOut = (roomIndex) => {
    const room = rooms[roomIndex];
    const checkoutTime = new Date().getTime();
    const charge = ((checkoutTime - room.checkInTime) / 1000) * 5;
    setRevenue(prev => [...prev, { roomNo: roomIndex + 1, date: new Date().toISOString().split('T')[0], amount: charge }]);
    const newRooms = [...rooms];
    newRooms[roomIndex] = { status: 'Available' };
    setRooms(newRooms);
    setCheckInTime(null);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.status === 'Occupied' ? { ...room, remainingTime: Math.max(0, room.duration - (new Date().getTime() - room.checkInTime) / 1000) } : room
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalRevenue = revenue.reduce((total, item) => total + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hotel Room Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={customer.firstName} onChange={e => setCustomer({...customer, firstName: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={customer.lastName} onChange={e => setCustomer({...customer, lastName: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="id">ID</Label>
                <Input id="id" value={customer.id} onChange={e => setCustomer({...customer, id: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="duration">Stay Duration (seconds)</Label>
                <Input id="duration" type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />
              </div>
            </div>
            <Button onClick={handleCheckIn} className="mt-4">Check In</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {rooms.map((room, index) => (
            <Card key={index} className={room.status === 'Available' ? 'cursor-pointer' : ''} onClick={() => room.status === 'Available' && setSelectedRoom(index)}>
              <CardContent className="p-2 text-center">
                {room.status === 'Available' ? 
                  <div>Available</div> : 
                  <>
                    <div>{room.customer.firstName}</div>
                    <div>{room.remainingTime ? `${Math.floor(room.remainingTime)}s` : 'Time Up'}</div>
                    <div>Room {index + 1}</div>
                    <Button onClick={() => handleCheckOut(index)} className="mt-2">Check Out</Button>
                  </>
                }
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {revenue.map((item, idx) => (
              <div key={idx}>
                Room {item.roomNo}: {item.date} - ${item.amount.toFixed(2)}
              </div>
            ))}
            <div className="mt-2 font-bold">Total Revenue: ${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;