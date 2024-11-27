import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CATEGORIES = ['Good', 'Bad'];

function App() {
  const [habits, setHabits] = useState([]);
  const [form, setForm] = useState({ category: CATEGORIES[0], count: 1, name: '', date: new Date() });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHabit, setSelectedHabit] = useState(null);

  const addHabit = (e) => {
    e.preventDefault();
    setHabits([...habits, { ...form, id: Date.now() }]);
    setForm({ category: CATEGORIES[0], count: 1, name: '', date: new Date() });
  };

  const filteredHabits = habits.filter(habit => 
    habit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const habitSummary = habits.reduce((acc, habit) => {
    const date = habit.date.toDateString();
    if (!acc[date]) acc[date] = { Good: 0, Bad: 0 };
    acc[date][habit.category] += 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add New Habit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addHabit} className="space-y-4">
            <Select value={form.category} onChange={(value) => setForm({...form, category: value})}>
              {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </Select>
            <Input type="number" value={form.count} onChange={e => setForm({...form, count: e.target.value})} placeholder="Count" min="1" />
            <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Habit Name" />
            <Calendar date={form.date} onDateChange={newDate => setForm({...form, date: newDate})} />
            <Button type="submit">Add Habit</Button>
          </form>
        </CardContent>
      </Card>

      <Input 
        className="mb-4" 
        placeholder="Search habits..." 
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Habits List</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredHabits.map(habit => (
                <div key={habit.id} onClick={() => setSelectedHabit(habit)} className="cursor-pointer hover:bg-gray-100 p-2">
                  {habit.name}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {selectedHabit && (
          <Card>
            <CardHeader>
              <CardTitle>Habit Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Name:</strong> {selectedHabit.name}</p>
              <p><strong>Category:</strong> {selectedHabit.category}</p>
              <p><strong>Count:</strong> {selectedHabit.count}</p>
              <p><strong>Date:</strong> {selectedHabit.date.toDateString()}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Habit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={Object.entries(habitSummary).map(([date, counts]) => ({ date, ...counts }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Good" stroke="#8884d8" />
              <Line type="monotone" dataKey="Bad" stroke="#82ca9d" />
            </LineChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;