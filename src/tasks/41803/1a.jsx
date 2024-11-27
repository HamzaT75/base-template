import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Table component
const Table = ({ id, isOccupied, timeLeft, onSelect }) => (
  <Card
    className={`cursor-pointer ${
      isOccupied ? "bg-gray-200" : "bg-cyan-200 hover:bg-cyan-300"
    }`}
    onClick={() => !isOccupied && onSelect(id)}
  >
    <CardContent className="p-4 text-center">
      <p>{isOccupied ? `Occupied (${timeLeft}s)` : "Available"}</p>
    </CardContent>
  </Card>
);

// Customer Form component
const CustomerForm = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [guests, setGuests] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, guests: parseInt(guests) });
    setFirstName("");
    setLastName("");
    setGuests("");
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
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="guests">Number of Guests</Label>
        <Input
          id="guests"
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          required
          min="1"
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

// Revenue Table component
const RevenueTable = ({ revenues }) => (
  <Card>
    <CardHeader>
      <CardTitle>Daily Revenue</CardTitle>
    </CardHeader>
    <CardContent>
      <table className="w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Tables</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {revenues.map((revenue, index) => (
            <tr key={index}>
              <td>{revenue.date}</td>
              <td>{revenue.customerName}</td>
              <td>{revenue.tables}</td>
              <td>${revenue.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

// Main App component
export default function App() {
  const [tables, setTables] = useState(
    Array(28).fill({ isOccupied: false, timeLeft: 0 })
  );
  const [selectedTables, setSelectedTables] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [revenues, setRevenues] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTables((prevTables) =>
        prevTables.map((table) => {
          if (table.isOccupied && table.timeLeft > 0) {
            return { ...table, timeLeft: table.timeLeft - 1 };
          } else if (table.isOccupied && table.timeLeft === 0) {
            return { isOccupied: false, timeLeft: 0 };
          }
          return table;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTableSelect = (id) => {
    if (selectedTables.includes(id)) {
      setSelectedTables(selectedTables.filter((tableId) => tableId !== id));
    } else {
      setSelectedTables([...selectedTables, id]);
    }
  };

  const handleCustomerSubmit = (customerData) => {
    setCustomer(customerData);
  };

  const handleBooking = () => {
    if (customer && selectedTables.length > 0) {
      const newTables = [...tables];
      selectedTables.forEach((id) => {
        newTables[id] = { isOccupied: true, timeLeft: 30 };
      });
      setTables(newTables);

      const amount = selectedTables.length * 20;
      const newRevenue = {
        date: new Date().toLocaleDateString(),
        customerName: `${customer.firstName} ${customer.lastName}`,
        tables: selectedTables.length,
        amount,
      };
      setRevenues([...revenues, newRevenue]);

      setCustomer(null);
      setSelectedTables([]);
    }
  };

  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Restaurant App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm onSubmit={handleCustomerSubmit} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Table Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {tables.map((table, index) => (
                <Table
                  key={index}
                  id={index}
                  isOccupied={table.isOccupied}
                  timeLeft={table.timeLeft}
                  onSelect={handleTableSelect}
                />
              ))}
            </div>
            <Button
              onClick={handleBooking}
              className="mt-4"
              disabled={!customer || selectedTables.length === 0}
            >
              Book Tables
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <RevenueTable revenues={revenues} />
        <p className="text-xl font-bold mt-4">Total Revenue: ${totalRevenue}</p>
      </div>
    </div>
  );
}