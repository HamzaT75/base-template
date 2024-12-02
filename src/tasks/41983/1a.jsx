import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

const commonTasks = ["Oil Change", "Tire Rotation", "Brake Inspection", "Air Filter Replacement"];

function TaskCard({ task, onDelete }) {
  const isOverdue = new Date(task.dueDate) < new Date();
  const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{task.name}</span>
          <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Next: {task.mileage.toLocaleString()} miles</p>
        <p className={isOverdue ? "text-red-500" : ""}>
          Due: {task.dueDate} {daysLeft <= 5 && !isOverdue && `(${daysLeft} days left)`}
        </p>
      </CardContent>
    </Card>
  );
}

function AddTaskForm({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [mileage, setMileage] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSave = () => {
    if (name && mileage && dueDate) {
      onSave({ name, mileage: parseInt(mileage), dueDate });
      onCancel();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="taskName">Task Name</Label>
        <Select onValueChange={setName} value={name}>
          <SelectTrigger id="taskName">
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            {commonTasks.map((task) => (
              <SelectItem key={task} value={task}>
                {task}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="mileage">Mileage</Label>
        <Input
          id="mileage"
          type="number"
          min="1000"
          max="25000"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />
      </div>
      <div>
        <Label>Due Date</Label>
        <Calendar
          mode="single"
          selected={dueDate ? new Date(dueDate) : undefined}
          onSelect={(date) => setDueDate(date?.toISOString().split("T")[0])}
          className="rounded-md border"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showAllTasks, setShowAllTasks] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem("carMaintenanceTasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carMaintenanceTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const upcomingTasks = tasks.filter((task) => {
    const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 5;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Car Maintenance Reminder</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-6">Add New Task</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Maintenance Task</DialogTitle>
          </DialogHeader>
          <AddTaskForm onSave={addTask} onCancel={() => {}} />
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl font-semibold mb-4">Upcoming Maintenance Reminders</h2>
      {upcomingTasks.length > 0 ? (
        upcomingTasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={deleteTask} />
        ))
      ) : (
        <p>No upcoming tasks</p>
      )}

      <Button onClick={() => setShowAllTasks(!showAllTasks)} className="mt-4 mb-6">
        {showAllTasks ? "Hide All Tasks" : "View All Tasks"}
      </Button>

      {showAllTasks && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Tasks</h2>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={deleteTask} />
          ))}
        </div>
      )}
    </div>
  );
}