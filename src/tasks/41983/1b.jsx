import React, { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays } from 'date-fns';

const commonTasks = ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Battery Check'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', mileage: '', date: '' });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTask({ name: '', mileage: '', date: '' });
  };

  const saveTask = () => {
    if (newTask.name && newTask.mileage && newTask.date) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      closeModal();
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const upcomingTasks = tasks.filter(task => {
    const dueDate = new Date(task.date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0;
  });

  const isOverdue = (date) => {
    return new Date(date) < new Date() && !isSameDay(new Date(date), new Date());
  };

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Car Maintenance Reminder</h1>
      <Button onClick={openModal}>Add New Task</Button>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Upcoming Maintenance</h2>
        {upcomingTasks.map(task => (
          <Card key={task.id} className="mb-2">
            <CardHeader>
              <CardTitle>{task.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Mileage: Next {task.mileage} miles</p>
              <p className={isOverdue(task.date) ? 'text-red-500' : ''}>
                Due: {format(new Date(task.date), 'yyyy-MM-dd')}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => deleteTask(task.id)} variant="destructive">Delete</Button>
            </CardFooter>
          </Card>
        ))}
        <Button onClick={() => alert('View all tasks functionality here')}>View All Tasks</Button>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full sm:w-96">
            <CardHeader>
              <CardTitle>Add Maintenance Task</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="taskName">Task Name</Label>
              <Input 
                id="taskName" 
                list="commonTasks" 
                value={newTask.name} 
                onChange={e => setNewTask({...newTask, name: e.target.value})} 
              />
              <datalist id="commonTasks">
                {commonTasks.map(task => <option key={task} value={task} />)}
              </datalist>

              <Label htmlFor="mileage">Mileage</Label>
              <Input 
                id="mileage" 
                type="number" 
                min="1000" 
                max="25000" 
                value={newTask.mileage} 
                onChange={e => setNewTask({...newTask, mileage: e.target.value})} 
              />

              <Label htmlFor="dueDate">Due Date</Label>
              <Input 
                id="dueDate" 
                type="date" 
                value={newTask.date} 
                onChange={e => setNewTask({...newTask, date: e.target.value})} 
              />
            </CardContent>
            <CardFooter>
              <Button onClick={saveTask}>Save</Button>
              <Button onClick={closeModal} variant="secondary">Cancel</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;