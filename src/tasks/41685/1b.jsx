import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// FoodItemForm component for adding new food items
const FoodItemForm = ({ onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName && calories && date) {
      onAddItem({ itemName, calories: Number(calories), date });
      setItemName('');
      setCalories('');
      setDate(new Date());
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Food Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="itemName">Item Name</Label>
            <Input id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="calories">Calories</Label>
            <Input id="calories" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} required />
          </div>
          <div className="mb-4">
            <Label>Date</Label>
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </div>
          <Button type="submit">Add Item</Button>
        </form>
      </CardContent>
    </Card>
  );
};

// DayList component to show and select days
const DayList = ({ days, onSelectDay }) => (
  <Card>
    <CardHeader>
      <CardTitle>Days</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {days.map(day => (
          <li key={day.date} onClick={() => onSelectDay(day.date)} className="cursor-pointer hover:bg-gray-100 p-2 rounded">
            {day.date.toDateString()} - Total: {day.totalCalories} cal
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// DetailView component to show items of a selected day
const DetailView = ({ selectedDayItems }) => (
  <Card>
    <CardHeader>
      <CardTitle>Details for Selected Day</CardTitle>
    </CardHeader>
    <CardContent>
      <ul>
        {selectedDayItems.map((item, idx) => (
          <li key={idx} className="mb-2">
            {item.itemName}: {item.calories} cal - {item.date.toDateString()}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// DailySummaryView component for the bar chart
const DailySummaryView = ({ days }) => (
  <Card>
    <CardHeader>
      <CardTitle>Daily Calorie Intake</CardTitle>
    </CardHeader>
    <CardContent>
      <BarChart width={500} height={300} data={days}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateString" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalCalories" fill="#8884d8" />
      </BarChart>
    </CardContent>
  </Card>
);

export default function App() {
  const [foodLog, setFoodLog] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const addFoodItem = (item) => {
    setFoodLog(prevLog => [...prevLog, item]);
  };

  const days = foodLog.reduce((acc, item) => {
    const dateString = item.date.toDateString();
    const existingDay = acc.find(day => day.dateString === dateString);
    if (existingDay) {
      existingDay.totalCalories += item.calories;
    } else {
      acc.push({ date: item.date, dateString, totalCalories: item.calories });
    }
    return acc;
  }, []);

  const selectedDayItems = foodLog.filter(item => item.date.toDateString() === selectedDay);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Fitness Tracker</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FoodItemForm onAddItem={addFoodItem} />
          <DayList days={days} onSelectDay={setSelectedDay} />
        </div>
        <div>
          {selectedDay && <DetailView selectedDayItems={selectedDayItems} />}
          <DailySummaryView days={days} />
        </div>
      </div>
    </div>
  );
}