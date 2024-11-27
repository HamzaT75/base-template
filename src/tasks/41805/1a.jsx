import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Seat component
const Seat = ({ number, status, customerName, onClick }) => (
  <Button
    className={`w-full h-full text-xs sm:text-sm ${
      status === "Reserved" ? "bg-green-500" : "bg-blue-500"
    }`}
    onClick={onClick}
  >
    {status === "Reserved" ? customerName : number}
  </Button>
);

// Customer Form component
const CustomerForm = ({ onSubmit, disabled }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [seats, setSeats] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, seats });
    setFirstName("");
    setLastName("");
    setSeats(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="seats">Number of Seats</Label>
        <Input
          id="seats"
          type="number"
          min="1"
          max="100"
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
          required
          disabled={disabled}
        />
      </div>
      <Button type="submit" disabled={disabled}>
        Reserve Seats
      </Button>
    </form>
  );
};

// Main App component
export default function App() {
  const [seats, setSeats] = useState(
    Array(100)
      .fill()
      .map((_, i) => ({ number: i + 1, status: "Empty", customerName: "" }))
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [isFullHouse, setIsFullHouse] = useState(false);

  useEffect(() => {
    const reservedSeats = seats.filter((seat) => seat.status === "Reserved");
    setTotalAmount(reservedSeats.length * 500);
    setIsFullHouse(reservedSeats.length === 100);
  }, [seats]);

  const handleReservation = ({ firstName, lastName, seats: seatCount }) => {
    const availableSeats = seats.filter((seat) => seat.status === "Empty");
    if (availableSeats.length < seatCount) {
      alert("Not enough seats available!");
      return;
    }

    const updatedSeats = [...seats];
    for (let i = 0; i < seatCount; i++) {
      const seatIndex = updatedSeats.findIndex(
        (seat) => seat.status === "Empty"
      );
      updatedSeats[seatIndex] = {
        ...updatedSeats[seatIndex],
        status: "Reserved",
        customerName: firstName,
      };
    }
    setSeats(updatedSeats);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Event Seat Reservation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">
              Seat Reservation
            </h2>
            <p className="text-lg font-semibold">
              Total Amount: ₹{totalAmount}
            </p>
          </div>
          <div className="grid grid-cols-10 gap-1 mb-8">
            {seats.map((seat) => (
              <Seat key={seat.number} {...seat} />
            ))}
          </div>
          {isFullHouse ? (
            <div className="text-center text-2xl font-bold text-red-500">
              Full House!
            </div>
          ) : (
            <CustomerForm onSubmit={handleReservation} disabled={isFullHouse} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}