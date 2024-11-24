import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

// Task component to render individual tasks
const Task = ({ task, onToggle, onEdit, onDelete }) => (
  <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
    <Checkbox
      checked={task.completed}
      onCheckedChange={() => onToggle(task.id)}
    />
    <div className="flex-grow">
      <p className={`text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
        {task.title}
      </p>
      <p className="text-xs text-gray-500">
        Due: {format(task.dueDate, "PPP")} | Duration: {task.duration}
      </p>
    </div>
    <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
      <Pencil className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

// TaskForm component for adding/editing tasks
const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || new Date());
  const [duration, setDuration] = useState(task?.duration || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: task?.id, title, dueDate, duration, completed: task?.completed || false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{task ? "Update" : "Add"} Task</Button>
      </div>
    </form>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setEditingTask(null);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {filteredTasks.map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                  />
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="pending">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {filteredTasks.map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                  />
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="completed">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {filteredTasks.map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                  />
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            <Button onClick={clearAllTasks} variant="destructive">
              Clear All Tasks
            </Button>
          </div>
          <div className="mt-4">
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? updateTask : addTask}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}