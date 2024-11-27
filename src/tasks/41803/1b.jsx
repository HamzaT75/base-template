import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function App() {
  const [tables, setTables] = useState(() => Array(28).fill({ status: 'available', timer: 0 }));
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', guests: 0 });
  const [selectedTables, setSelectedTables] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Function to handle table selection
  const selectTable = (index) => {
    if (tables[index].status === 'available' && selectedTables.length < customer.guests) {
      const newTables = [...tables];
      newTables[index] = { ...newTables[index], status: 'selected' };
      setTables(newTables);
      setSelectedTables([...selectedTables, index]);
    }
  };

  // Function to start booking
  const bookTables = () => {
    if (selectedTables.length === customer.guests) {
      const newTables = tables.map((table, idx) => 
        selectedTables.includes(idx) ? { ...table, status: 'occupied', timer: 30 } : table);
      setTables(newTables);
      const booking = {
        date: new Date().toLocaleDateString(),
        name: `${customer.firstName} ${customer.lastName}`,
        tables: selectedTables.length,
        amount: selectedTables.length * 20
      };
      setRevenue([...revenue, booking]);
      setTotalRevenue(totalRevenue + booking.amount);
    }
  };

  // Timer logic for occupied tables
  useEffect(() => {
    const timer = setInterval(() => {
      setTables(prevTables => 
        prevTables.map(table => {
          if (table.status === 'occupied' && table.timer > 0) {
            return { ...table, timer: table.timer - 1 };
          } else if (table.timer === 0) {
            return { ...table, status: 'available', timer: 0 };
          }
          return table;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset selected tables when booking is done or cancelled
  useEffect(() => {
    if (selectedTables.length > 0 && !tables.some(t => t.status === 'selected')) {
      setSelectedTables([]);
    }
  }, [tables]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center my-6">Restaurant Table Booking</h1>

      {/* Customer Input Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="First Name" 
              value={customer.firstName} 
              onChange={e => setCustomer({...customer, firstName: e.target.value})} 
            />
            <Input 
              placeholder="Last Name" 
              value={customer.lastName} 
              onChange={e => setCustomer({...customer, lastName: e.target.value})} 
            />
            <Input 
              type="number" 
              placeholder="Number of Guests" 
              value={customer.guests} 
              onChange={e => setCustomer({...customer, guests: Number(e.target.value)})} 
            />
            <Button onClick={bookTables} disabled={selectedTables.length !== customer.guests}>Book Tables</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {tables.map((table, index) => (
          <div 
            key={index} 
            className={`p-4 text-center rounded ${table.status === 'available' ? 'bg-cyan-100' : 'bg-gray-300'} cursor-pointer`}
            onClick={() => selectTable(index)}
          >
            {table.status === 'occupied' ? `Table ${index + 1} (${table.timer}s)` : `Table ${index + 1}`}
          </div>
        ))}
      </div>

      {/* Revenue Details */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {revenue.map((entry, idx) => (
            <div key={idx} className="border-b py-2">
              {entry.date} - {entry.name} - Tables: {entry.tables} - ${entry.amount}
            </div>
          ))}
          <div className="mt-4 font-bold">Total Revenue: ${totalRevenue}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;