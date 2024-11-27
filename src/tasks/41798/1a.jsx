import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Utility function to format time
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Room component
const Room = ({ room, onCheckIn, onCheckOut }) => {
  const [remainingTime, setRemainingTime] = useState(room.duration);

  useEffect(() => {
    let timer;
    if (room.occupied && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [room.occupied, remainingTime]);

  useEffect(() => {
    if (remainingTime === 0 && room.occupied) {
      onCheckOut(room.number);
    }
  }, [remainingTime, room.occupied, room.number, onCheckOut]);

  return (
    <Card className={`h-32 ${room.occupied ? "bg-green-100" : "bg-white"}`}>
      <CardContent className="p-2 text-center">
        {room.occupied ? (
          <>
            <p className="font-bold">{room.customer.firstName}</p>
            <p>{formatTime(remainingTime)}</p>
            <p>Room {room.number}</p>
          </>
        ) : (
          <p className="mt-8">Available</p>
        )}
      </CardContent>
    </Card>
  );
};

// Main App component
export default function App() {
  const [rooms, setRooms] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
      occupied: false,
      customer: null,
      duration: 0,
    }))
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [id, setId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [duration, setDuration] = useState("");
  const [revenue, setRevenue] = useState([]);

  const handleCheckIn = () => {
    if (!firstName || !lastName || !id || !selectedRoom || !duration) return;

    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.number === selectedRoom
          ? {
              ...room,
              occupied: true,
              customer: { firstName, lastName, id },
              duration: parseInt(duration),
            }
          : room
      )
    );

    setFirstName("");
    setLastName("");
    setId("");
    setSelectedRoom(null);
    setDuration("");
  };

  const handleCheckOut = (roomNumber) => {
    const room = rooms.find((r) => r.number === roomNumber);
    if (!room || !room.occupied) return;

    const amount = (room.duration - (room.duration % 60)) * (5 / 60);
    setRevenue((prev) => [
      ...prev,
      { roomNo: roomNumber, date: new Date().toLocaleDateString(), amount },
    ]);

    setRooms((prevRooms) =>
      prevRooms.map((r) =>
        r.number === roomNumber
          ? { ...r, occupied: false, customer: null, duration: 0 }
          : r
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hotel Room Booking</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <select
                id="room"
                className="w-full p-2 border rounded"
                value={selectedRoom || ""}
                onChange={(e) => setSelectedRoom(Number(e.target.value))}
              >
                <option value="">Select a room</option>
                {rooms
                  .filter((room) => !room.occupied)
                  .map((room) => (
                    <option key={room.number} value={room.number}>
                      Room {room.number}
                    </option>
                  ))}
              </select>
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <Button onClick={handleCheckIn}>Check In</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {rooms.map((room) => (
          <Room
            key={room.number}
            room={room}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>Room</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.roomNo}</td>
                  <td>{entry.date}</td>
                  <td>${entry.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 font-bold">
            Total: $
            {revenue.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}