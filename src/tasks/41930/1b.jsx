import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Court({ name, occupied, timeLeft, onFree }) {
  useEffect(() => {
    let timer;
    if (occupied && timeLeft > 0) {
      timer = setTimeout(() => onFree(), timeLeft * 1000);
    }
    return () => clearTimeout(timer);
  }, [occupied, timeLeft, onFree]);

  return (
    <Card className={`w-full ${occupied ? 'bg-pink-200' : 'bg-blue-200'}`}>
      <CardHeader>
        <CardTitle>{`Court B${name}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {occupied ? (
          <>
            <p>{name}</p>
            <p>Time Left: {timeLeft}s</p>
          </>
        ) : (
          <p>Unoccupied</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [courts, setCourts] = useState([
    { id: 'B1', occupied: false, customerName: '', customerId: '', timeLeft: 120, earnings: 0 },
    { id: 'B2', occupied: false, customerName: '', customerId: '', timeLeft: 120, earnings: 0 },
    { id: 'B3', occupied: false, customerName: '', customerId: '', timeLeft: 120, earnings: 0 },
    { id: 'B4', occupied: false, customerName: '', customerId: '', timeLeft: 120, earnings: 0 },
  ]);
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [showAccounts, setShowAccounts] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const bookCourt = () => {
    const newCourts = [...courts];
    const firstFreeCourtIndex = newCourts.findIndex(court => !court.occupied);
    if (firstFreeCourtIndex !== -1 && customerName && customerId) {
      newCourts[firstFreeCourtIndex] = {
        ...newCourts[firstFreeCourtIndex],
        occupied: true,
        customerName,
        customerId,
        timeLeft: 120, // 2 minutes in seconds
        earnings: newCourts[firstFreeCourtIndex].earnings + 10, // $5 per minute, 2 minutes
      };
      setCourts(newCourts);
      setCustomerName('');
      setCustomerId('');
      setTotalEarnings(totalEarnings + 10);
    }
  };

  const freeCourt = (courtId) => {
    setCourts(courts.map(court => 
      court.id === courtId ? { ...court, occupied: false, customerName: '', customerId: '', timeLeft: 120 } : court
    ));
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
      <div className="w-full sm:w-auto">
        <input 
          value={customerName} 
          onChange={e => setCustomerName(e.target.value)} 
          placeholder="Customer Name" 
          className="p-2 border rounded w-full mb-2"
        />
        <input 
          value={customerId} 
          onChange={e => setCustomerId(e.target.value)} 
          placeholder="Customer ID" 
          className="p-2 border rounded w-full mb-2"
        />
        <Button onClick={bookCourt} className="w-full">Book Court</Button>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        {courts.map(court => (
          <Court 
            key={court.id} 
            name={court.customerName || court.id} 
            occupied={court.occupied} 
            timeLeft={court.timeLeft} 
            onFree={() => freeCourt(court.id)} 
          />
        ))}
      </div>
      <Button onClick={() => setShowAccounts(!showAccounts)} className="sm:col-span-2">
        {showAccounts ? 'Hide Accounts' : 'Show Accounts'}
      </Button>
      {showAccounts && (
        <div className="sm:col-span-2 w-full">
          {courts.map(court => (
            <p key={court.id}>Court {court.id}: ${court.earnings}</p>
          ))}
          <p>Total: ${totalEarnings}</p>
        </div>
      )}
    </div>
  );
}