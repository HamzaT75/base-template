import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Utility function to group food items by date
const groupByDate = (items) => {
  return items.reduce((acc, item) => {
    const date = item.date.toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

// Add Food Item Form Component
const AddFoodForm = ({ onAddFood }) => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && calories && date) {
      onAddFood({ name, calories: parseInt(calories), date });
      setName("");
      setCalories("");
      setDate(new Date());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Food Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <Button type="submit" className="w-full">
            Add Food Item
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Day List Component
const DayList = ({ days, onSelectDay, selectedDay }) => (
  <Card className="w-full max-w-md mx-auto mt-4">
    <CardHeader>
      <CardTitle>Day List</CardTitle>
    </CardHeader>
    <CardContent>
      <Select onValueChange={onSelectDay} value={selectedDay}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a day" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(days).map(([date, items]) => (
            <SelectItem key={date} value={date}>
              {date} - Total Calories:{" "}
              {items.reduce((sum, item) => sum + item.calories, 0)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CardContent>
  </Card>
);

// Detail View Component
const DetailView = ({ items }) => (
  <Card className="w-full max-w-md mx-auto mt-4">
    <CardHeader>
      <CardTitle>Daily Details</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{item.name}</span>
            <span>{item.calories} calories</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// Daily Summary Chart Component
const DailySummaryChart = ({ days }) => {
  const maxCalories = Math.max(
    ...Object.values(days).map((items) =>
      items.reduce((sum, item) => sum + item.calories, 0)
    )
  );

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Daily Calorie Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end space-x-2 h-40">
          {Object.entries(days).map(([date, items]) => {
            const totalCalories = items.reduce(
              (sum, item) => sum + item.calories,
              0
            );
            const height = (totalCalories / maxCalories) * 100;
            return (
              <div
                key={date}
                className="flex flex-col items-center"
                style={{ height: `${height}%` }}
              >
                <div className="w-8 bg-blue-500 flex-grow"></div>
                <span className="text-xs mt-1">{date.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Main App Component
export default function App() {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleAddFood = (newItem) => {
    setFoodItems([...foodItems, newItem]);
  };

  const groupedDays = groupByDate(foodItems);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Fitness Tracking App
      </h1>
      <AddFoodForm onAddFood={handleAddFood} />
      <DayList
        days={groupedDays}
        onSelectDay={setSelectedDay}
        selectedDay={selectedDay}
      />
      {selectedDay && <DetailView items={groupedDays[selectedDay]} />}
      <DailySummaryChart days={groupedDays} />
    </div>
  );
}