import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Court = ({ id, customer, timeLeft, onTimeUp }) => {
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => onTimeUp(id), timeLeft * 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, onTimeUp, id]);

  return (
    <Card className={`h-full ${customer ? "bg-pink-200" : "bg-blue-200"}`}>
      <CardHeader>
        <CardTitle>Court B{id}</CardTitle>
      </CardHeader>
      <CardContent>
        {customer ? (
          <>
            <p>{customer.name}</p>
            <p>Time left: {timeLeft}s</p>
          </>
        ) : (
          <p>Unoccupied</p>
        )}
      </CardContent>
    </Card>
  );
};

const CustomerForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, id });
    setName("");
    setId("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="id">ID</Label>
        <Input
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Book Court</Button>
    </form>
  );
};

const AccountsDialog = ({ courts }) => {
  const totalAmount = courts.reduce((sum, court) => sum + court.collection, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Show Accounts</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Court Collections</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {courts.map((court) => (
            <p key={court.id}>
              Court B{court.id}: ${court.collection.toFixed(2)}
            </p>
          ))}
          <p className="font-bold">Total: ${totalAmount.toFixed(2)}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [courts, setCourts] = useState([
    { id: 1, customer: null, timeLeft: 0, collection: 0 },
    { id: 2, customer: null, timeLeft: 0, collection: 0 },
    { id: 3, customer: null, timeLeft: 0, collection: 0 },
    { id: 4, customer: null, timeLeft: 0, collection: 0 },
  ]);

  const bookCourt = (customer) => {
    const availableCourt = courts.find((court) => !court.customer);
    if (availableCourt) {
      setCourts((prevCourts) =>
        prevCourts.map((court) =>
          court.id === availableCourt.id
            ? { ...court, customer, timeLeft: 120 }
            : court
        )
      );
    } else {
      alert("No courts available");
    }
  };

  const handleTimeUp = (courtId) => {
    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court.id === courtId
          ? {
              ...court,
              customer: null,
              timeLeft: 0,
              collection: court.collection + 10, // $5 per minute for 2 minutes
            }
          : court
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sports Court Booking</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {courts.map((court) => (
          <Court
            key={court.id}
            id={court.id}
            customer={court.customer}
            timeLeft={court.timeLeft}
            onTimeUp={handleTimeUp}
          />
        ))}
      </div>
      <div className="mb-4">
        <CustomerForm onSubmit={bookCourt} />
      </div>
      <AccountsDialog courts={courts} />
    </div>
  );
}