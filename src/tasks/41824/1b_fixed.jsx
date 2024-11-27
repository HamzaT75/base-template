import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// HabitForm component for adding new habits
const HabitForm = ({ onAddHabit }) => {
  const [habit, setHabit] = useState({ category: "", count: "", name: "", date: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddHabit(habit);
    setHabit({ category: "", count: "", name: "", date: "" });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={habit.category}
              onValueChange={(value) => setHabit({ ...habit, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Bad">Bad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="count">Count</Label>
            <Input
              type="number"
              id="count"
              value={habit.count}
              onChange={(e) => setHabit({ ...habit, count: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={habit.name}
              onChange={(e) => setHabit({ ...habit, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              value={habit.date}
              onChange={(e) => setHabit({ ...habit, date: e.target.value })}
              required
            />
          </div>
          <Button type="submit">Add Habit</Button>
        </form>
      </CardContent>
    </Card>
  );
};

// HabitList component for displaying and filtering habits
const HabitList = ({ habits, onSelectHabit }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHabits = habits.filter((habit) =>
    habit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Habit List</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search habits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <ul className="space-y-2">
          {filteredHabits.map((habit, index) => (
            <li key={index}>
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => onSelectHabit(habit)}
              >
                {habit.name}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// DetailView component for displaying habit details
const DetailView = ({ habit }) => {
  if (!habit) return null;

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Habit Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Category:</strong> {habit.category}</p>
        <p><strong>Count:</strong> {habit.count}</p>
        <p><strong>Name:</strong> {habit.name}</p>
        <p><strong>Date:</strong> {habit.date}</p>
      </CardContent>
    </Card>
  );
};

// SummaryView component for displaying habit summary chart
const SummaryView = ({ habits }) => {
  const summaryData = habits.reduce((acc, habit) => {
    const date = habit.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += parseInt(habit.count);
    return acc;
  }, {});

  const chartData = Object.entries(summaryData).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Habit Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </CardContent>
    </Card>
  );
};

// Main App component
export default function App() {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const addHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Habit Tracker</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <HabitForm onAddHabit={addHabit} />
          <HabitList habits={habits} onSelectHabit={setSelectedHabit} />
        </div>
        <div>
          <DetailView habit={selectedHabit} />
          <SummaryView habits={habits} />
        </div>
      </div>
    </div>
  );
}