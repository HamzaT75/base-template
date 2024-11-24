import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { Switch } from "@/components/ui/switch";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', duration: '' });

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'Pending': return tasks.filter(task => !task.completed);
      case 'Completed': return tasks.filter(task => task.completed);
      default: return tasks;
    }
  }, [tasks, filter]);

  const addTask = () => {
    if (newTask.title && newTask.dueDate && newTask.duration) {
      setTasks([...tasks, { ...newTask, completed: false, id: Date.now() }]);
      setNewTask({ title: '', dueDate: '', duration: '' });
    }
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const toggleComplete = (id) => {
    updateTask(id, 'completed', !tasks.find(t => t.id === id).completed);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
          <CardDescription>Add and manage your tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              value={newTask.title} 
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              placeholder="Task Title" 
              className="w-full"
            />
            <div className="flex space-x-2">
              <Input 
                value={newTask.dueDate} 
                onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                placeholder="Due Date" 
                type="date" 
                className="flex-grow"
              />
              <Input 
                value={newTask.duration} 
                onChange={e => setNewTask({...newTask, duration: e.target.value})}
                placeholder="Duration" 
                className="flex-grow"
              />
            </div>
            <Button onClick={addTask}>Add Task</Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between mb-4">
            <Button variant={filter === 'All' ? 'default' : 'outline'} onClick={() => setFilter('All')}>All</Button>
            <Button variant={filter === 'Pending' ? 'default' : 'outline'} onClick={() => setFilter('Pending')}>Pending</Button>
            <Button variant={filter === 'Completed' ? 'default' : 'outline'} onClick={() => setFilter('Completed')}>Completed</Button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={toggleComplete} 
                onDelete={deleteTask} 
                onUpdate={updateTask} 
              />
            ))}
          </div>
          {tasks.length > 0 && (
            <Button onClick={clearAllTasks} variant="destructive" className="mt-4 w-full">
              Clear All Tasks
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  return (
    <div className="flex items-center justify-between mb-2 p-2 bg-white rounded shadow-sm">
      <div className="flex-grow">
        <Input 
          value={task.title} 
          onChange={e => onUpdate(task.id, 'title', e.target.value)} 
          className="w-4/5 mr-2"
        />
        <div className="flex">
          <Input 
            value={task.dueDate} 
            onChange={e => onUpdate(task.id, 'dueDate', e.target.value)} 
            type="date" 
            className="w-1/5 mr-2"
          />
          <Input 
            value={task.duration} 
            onChange={e => onUpdate(task.id, 'duration', e.target.value)} 
            className="w-1/5"
          />
        </div>
      </div>
      <div className="flex items-center">
        <Switch 
          checked={task.completed} 
          onCheckedChange={() => onToggle(task.id)} 
          className="mr-2"
        />
        <Button onClick={() => onDelete(task.id)} variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
    </div>
  );
}