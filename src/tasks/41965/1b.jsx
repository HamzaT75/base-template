import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Task component to display individual tasks
const Task = ({ task, onSelect }) => (
  <Card className="mb-4 cursor-pointer hover:bg-gray-100" onClick={() => onSelect(task)}>
    <CardHeader>
      <CardTitle>{task.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">{task.day}</p>
    </CardContent>
  </Card>
);

// TaskDetail component to show detailed view of a task
const TaskDetail = ({ task }) => (
  <Card>
    <CardHeader>
      <CardTitle>{task.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p><strong>Day:</strong> {task.day}</p>
      <p><strong>Description:</strong> {task.description}</p>
    </CardContent>
  </Card>
);

// WeeklyCalendar component to display tasks in a grid
const WeeklyCalendar = ({ tasks }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => (
        <div key={day} className="border p-2">
          <h3 className="font-bold mb-2">{day}</h3>
          {tasks.filter((task) => task.day === day).map((task) => (
            <p key={task.name} className="text-sm">{task.name}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && description && day) {
      setTasks([...tasks, { name, description, day }]);
      setName("");
      setDescription("");
      setDay("");
    }
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Garden Management App</h1>
      
      {/* Task input form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="day">Day</Label>
            <Select value={day} onValueChange={setDay} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="mt-4">Add Task</Button>
      </form>

      {/* Search bar */}
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Task list */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Tasks</h2>
          {filteredTasks.map((task) => (
            <Task key={task.name} task={task} onSelect={setSelectedTask} />
          ))}
        </div>

        {/* Task detail view */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Task Detail</h2>
          {selectedTask ? (
            <TaskDetail task={selectedTask} />
          ) : (
            <p>Select a task to view details</p>
          )}
        </div>
      </div>

      {/* Weekly calendar */}
      <h2 className="text-2xl font-bold my-4">Weekly Overview</h2>
      <WeeklyCalendar tasks={tasks} />
    </div>
  );
}