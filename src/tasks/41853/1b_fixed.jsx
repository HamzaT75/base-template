import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
// import { Bar } from "@/components/ui/bar";
import { Bar } from 'recharts';

// Workout types
const workoutTypes = ["Cardio", "Strength", "Flexibility", "Balance"];

// Helper function to group workouts by week
const groupByWeek = (workouts) => {
  const grouped = {};
  workouts.forEach((workout) => {
    const weekStart = new Date(workout.date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];
    if (!grouped[weekKey]) grouped[weekKey] = { calories: 0, duration: 0 };
    grouped[weekKey].calories += workout.calories;
    grouped[weekKey].duration += workout.duration;
  });
  return Object.entries(grouped).map(([week, data]) => ({ week, ...data }));
};

export default function App() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchType, setSearchType] = useState("");
  const [newWorkout, setNewWorkout] = useState({
    type: "",
    duration: "",
    calories: "",
    date: new Date(),
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout({ ...newWorkout, [name]: value });
  };

  // Handle workout type selection
  const handleTypeChange = (type) => {
    setNewWorkout({ ...newWorkout, type });
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setNewWorkout({ ...newWorkout, date });
  };

  // Add new workout
  const addWorkout = (e) => {
    e.preventDefault();
    setWorkouts([...workouts, { ...newWorkout, id: Date.now() }]);
    setNewWorkout({ type: "", duration: "", calories: "", date: new Date() });
  };

  // Filter workouts by type
  const filteredWorkouts = workouts.filter((workout) =>
    workout.type.toLowerCase().includes(searchType.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Workout Tracker</h1>

      {/* Add Workout Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Workout Session</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addWorkout} className="space-y-4">
            <div>
              <Label>Type</Label>
              <div className="flex space-x-4">
                {workoutTypes.map((type) => (
                  <div key={type} className="flex items-center">
                    <Checkbox
                      id={type}
                      checked={newWorkout.type === type}
                      onCheckedChange={() => handleTypeChange(type)}
                    />
                    <Label htmlFor={type} className="ml-2">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={newWorkout.duration}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="calories">Calories Burned</Label>
              <Input
                id="calories"
                name="calories"
                type="number"
                value={newWorkout.calories}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={newWorkout.date}
                onSelect={handleDateChange}
                className="rounded-md border"
              />
            </div>
            <Button type="submit">Add Workout</Button>
          </form>
        </CardContent>
      </Card>

      {/* Workout List and Detail View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workout Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by type..."
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="mb-4"
            />
            <ul className="space-y-2">
              {filteredWorkouts.map((workout) => (
                <li
                  key={workout.id}
                  onClick={() => setSelectedWorkout(workout)}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  {workout.type} - {workout.date.toDateString()}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {selectedWorkout && (
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Type: {selectedWorkout.type}</p>
              <p>Duration: {selectedWorkout.duration} minutes</p>
              <p>Calories Burned: {selectedWorkout.calories}</p>
              <p>Date: {selectedWorkout.date.toDateString()}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary View */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar
              data={{
                labels: groupByWeek(workouts).map((w) => w.week),
                datasets: [
                  {
                    label: "Calories Burned",
                    data: groupByWeek(workouts).map((w) => w.calories),
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                  {
                    label: "Duration (minutes)",
                    data: groupByWeek(workouts).map((w) => w.duration),
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}