// import React, { useState, useMemo } from 'react';
// import { 
//   Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
//   Input, Button, Select, SelectItem, Label,
// } from "@/components/ui";
// import { Check, Search, CalendarDays } from 'lucide-react';

// // Task Form Component
// function TaskForm({ addTask }) {
//   const [task, setTask] = useState({ name: '', description: '', day: '' });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if(task.name && task.day) {
//       addTask({...task, id: Date.now()});
//       setTask({ name: '', description: '', day: '' });
//     }
//   };

//   return (
//     <Card className="mb-4">
//       <CardHeader>
//         <CardTitle>Add New Task</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-2 mb-2">
//             <Label htmlFor="name">Task Name</Label>
//             <Input id="name" value={task.name} onChange={e => setTask({...task, name: e.target.value})} placeholder="Water the plants" required />
//           </div>
//           <div className="grid gap-2 mb-2">
//             <Label htmlFor="description">Description</Label>
//             <Input id="description" value={task.description} onChange={e => setTask({...task, description: e.target.value})} placeholder="Use fertilizer too" />
//           </div>
//           <div className="grid gap-2 mb-4">
//             <Label htmlFor="day">Day</Label>
//             <Select id="day" value={task.day} onChange={day => setTask({...task, day})}>
//               <SelectItem value="">Choose a day</SelectItem>
//               {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
//                 <SelectItem key={day} value={day}>{day}</SelectItem>
//               ))}
//             </Select>
//           </div>
//           <Button type="submit">Add Task</Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

// // Task List Component
// function TaskList({ tasks, onSelectTask, filter }) {
//   const filteredTasks = useMemo(() => 
//     tasks.filter(task => task.name.toLowerCase().includes(filter.toLowerCase())),
//     [tasks, filter]
//   );

//   return (
//     <div className="space-y-2">
//       {filteredTasks.map(task => (
//         <Card key={task.id} className="cursor-pointer" onClick={() => onSelectTask(task)}>
//           <CardContent>
//             <p>{task.name} - {task.day}</p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

// // Task Detail Component
// function TaskDetail({ task }) {
//   if (!task) return <p className="text-center">Select a task to see details.</p>;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{task.name}</CardTitle>
//         <CardDescription>{task.day}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p>{task.description}</p>
//       </CardContent>
//     </Card>
//   );
// }

// // Weekly Summary Component
// function WeeklySummary({ tasks }) {
//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const tasksByDay = useMemo(() => {
//     return days.reduce((acc, day) => {
//       acc[day] = tasks.filter(task => task.day === day);
//       return acc;
//     }, {});
//   }, [tasks]);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2">
//       {days.map(day => (
//         <Card key={day}>
//           <CardHeader>
//             <CardTitle>{day}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul>
//               {tasksByDay[day].map(task => (
//                 <li key={task.id}>{task.name}</li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

// // Main App Component
// export default function App() {
//   const [tasks, setTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [searchFilter, setSearchFilter] = useState('');

//   const addTask = (task) => {
//     setTasks([...tasks, task]);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">Garden Management App</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-2">
//           <TaskForm addTask={addTask} />
//           <div className="flex mb-4">
//             <Input 
//               placeholder="Search tasks..." 
//               className="flex-grow mr-2"
//               value={searchFilter}
//               onChange={e => setSearchFilter(e.target.value)}
//             />
//             <Button><Search /></Button>
//           </div>
//           <TaskList tasks={tasks} onSelectTask={setSelectedTask} filter={searchFilter} />
//         </div>
//         <div>
//           <TaskDetail task={selectedTask} />
//           <div className="mt-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center"><CalendarDays className="mr-2" />Weekly Overview</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <WeeklySummary tasks={tasks} />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }