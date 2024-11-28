import React, { useState, useMemo } from 'react';
// import { 
//   Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
//   Input, Button, Checkbox, Label, Select, SelectItem
// } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Form component for adding a workout
function WorkoutForm({ onAddWorkout }) {
  const [workout, setWorkout] = useState({
    type: '',
    duration: '',
    calories: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (workout.type && workout.duration && workout.calories) {
      onAddWorkout({...workout, duration: parseInt(workout.duration), calories: parseInt(workout.calories)});
      setWorkout({ type: '', duration: '', calories: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Workout Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            {['Cardio', 'Strength', 'Flexibility', 'Balance'].map(type => (
              <div key={type}>
                <Checkbox 
                  checked={workout.type === type} 
                  onCheckedChange={() => setWorkout({...workout, type: type})}
                  id={type}
                />
                <label htmlFor={type} className="ml-2">{type}</label>
              </div>
            ))}
          </div>
          <Input 
            type="number" 
            placeholder="Duration (min)" 
            value={workout.duration} 
            onChange={e => setWorkout({...workout, duration: e.target.value})} 
          />
          <Input 
            type="number" 
            placeholder="Calories Burned" 
            value={workout.calories} 
            onChange={e => setWorkout({...workout, calories: e.target.value})} 
          />
          <Input 
            type="date" 
            value={workout.date} 
            onChange={e => setWorkout({...workout, date: e.target.value})} 
          />
          <Button type="submit">Add Workout</Button>
        </form>
      </CardContent>
    </Card>
  );
}

// List component for displaying workouts
function WorkoutList({ workouts, onSelectWorkout }) {
  const [searchType, setSearchType] = useState('');
  
  const filteredWorkouts = useMemo(() => 
    workouts.filter(w => searchType === '' || w.type === searchType),
    [workouts, searchType]
  );

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Workout Sessions</CardTitle>
        <Input 
          placeholder="Search by type" 
          value={searchType} 
          onChange={e => setSearchType(e.target.value)} 
        />
      </CardHeader>
      <CardContent>
        {filteredWorkouts.map(workout => (
          <div key={workout.date + workout.type} onClick={() => onSelectWorkout(workout)} className="cursor-pointer hover:bg-gray-100 p-2">
            {workout.type} - {workout.date}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Detail view for a selected workout
function WorkoutDetail({ workout }) {
  if (!workout) return <p>Select a workout to view details.</p>;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Type: {workout.type}</p>
        <p>Duration: {workout.duration} min</p>
        <p>Calories Burned: {workout.calories}</p>
        <p>Date: {workout.date}</p>
      </CardContent>
    </Card>
  );
}

// Summary view component
function WorkoutSummary({ workouts }) {
  const data = useMemo(() => {
    const now = new Date();
    const currentWeekStart = startOfWeek(now);
    const weeks = [currentWeekStart, startOfWeek(addWeeks(currentWeekStart, 1))];

    return weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart);
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      const weekData = days.reduce((acc, day) => {
        const dayWorkouts = workouts.filter(w => w.date === format(day, 'yyyy-MM-dd'));
        acc.duration += dayWorkouts.reduce((sum, w) => sum + w.duration, 0);
        acc.calories += dayWorkouts.reduce((sum, w) => sum + w.calories, 0);
        return acc;
      }, { duration: 0, calories: 0 });
      
      return {
        name: `Week ${format(weekStart, 'w')}`,
        Calories: weekData.calories,
        Duration: weekData.duration
      };
    });
  }, [workouts]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Calories" fill="#8884d8" />
            <Bar dataKey="Duration" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handleAddWorkout = (workout) => {
    setWorkouts(prev => [...prev, workout]);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mt-8 mb-4">Workout Tracker</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <WorkoutForm onAddWorkout={handleAddWorkout} />
          <WorkoutList workouts={workouts} onSelectWorkout={setSelectedWorkout} />
        </div>
        <div>
          <WorkoutDetail workout={selectedWorkout} />
          <WorkoutSummary workouts={workouts} />
        </div>
      </div>
    </div>
  );
}