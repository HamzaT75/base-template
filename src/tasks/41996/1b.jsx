import React, { useState, useEffect } from 'react';
import { format, differenceInDays, isWithinInterval, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { X } from "lucide-react";

const App = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState(new Date());

  useEffect(() => {
    const storedBirthdays = JSON.parse(localStorage.getItem('birthdays') || '[]');
    setBirthdays(storedBirthdays);
  }, []);

  useEffect(() => {
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
  }, [birthdays]);

  const today = new Date();
  const weekFromToday = new Date(today);
  weekFromToday.setDate(weekFromToday.getDate() + 7);

  const sortedBirthdays = [...birthdays].sort((a, b) => {
    const daysA = differenceInDays(parseISO(a.date), today);
    const daysB = differenceInDays(parseISO(b.date), today);
    return daysA - daysB;
  });

  const upcomingBirthdays = sortedBirthdays.filter(b => 
    isWithinInterval(parseISO(b.date), { start: today, end: weekFromToday })
  );

  const addBirthday = () => {
    if (newName && newDate) {
      setBirthdays([...birthdays, { name: newName, date: format(newDate, 'yyyy-MM-dd') }]);
      setNewName('');
      setNewDate(new Date());
      setShowAddForm(false);
    }
  };

  const removeBirthday = (index) => {
    setBirthdays(birthdays.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Birthday Reminder</h1>
      {!showAddForm ? (
        <>
          <Button onClick={() => setShowAddForm(true)} className="mb-4">+</Button>
          <Card>
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBirthdays.map((b, idx) => (
                <div key={idx} className="flex justify-between items-center mb-2">
                  <span>{b.name}</span>
                  <span>{differenceInDays(parseISO(b.date), today)} days</span>
                  <span>{format(parseISO(b.date), 'MMMM d')}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Collapsible>
            <CollapsibleTrigger>Upcoming Birthdays</CollapsibleTrigger>
            <CollapsibleContent>
              {sortedBirthdays.map((b, idx) => (
                <div key={idx} className="flex justify-between items-center mb-2">
                  <span>{b.name}</span>
                  <span>{differenceInDays(parseISO(b.date), today)} days</span>
                  <span>{format(parseISO(b.date), 'MMMM d')}</span>
                  <X onClick={() => removeBirthday(idx)} className="cursor-pointer" />
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add Birthday</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} />
            <Calendar mode="single" selected={newDate} onSelect={setNewDate} className="mt-4" />
            <div className="mt-4 flex justify-between">
              <Button onClick={() => setShowAddForm(false)}>Back</Button>
              <Button onClick={addBirthday}>Save</Button>
              <Button onClick={() => { setShowAddForm(false); setNewName(''); setNewDate(new Date()); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default App;