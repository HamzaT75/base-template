// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectItem } from "@/components/ui/select";
// import { format } from 'date-fns';

// function App() {
//   const [entries, setEntries] = useState([]);
//   const [formData, setFormData] = useState({
//     date: new Date(),
//     day: 'Monday',
//     tasks: '',
//     goals: '',
//     highlights: '',
//     challenges: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setEntries(prevEntries => [...prevEntries, { ...formData, date: formData.date.toISOString().split('T')[0] }]);
//     setFormData({
//       date: new Date(),
//       day: 'Monday',
//       tasks: '',
//       goals: '',
//       highlights: '',
//       challenges: '',
//     });
//   };

//   const handleReset = () => {
//     setFormData({
//       date: new Date(),
//       day: 'Monday',
//       tasks: '',
//       goals: '',
//       highlights: '',
//       challenges: '',
//     });
//   };

//   return (
//     <div className="container mx-auto p-4 sm:p-8">
//       <h1 className="text-2xl font-bold mb-4">Daily Journal</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-2">Select Date</label>
//           <Input type="date" name="date" value={format(formData.date, 'yyyy-MM-dd')} onChange={handleChange} />
//         </div>
//         <div>
//           <label className="block mb-2">Select Day</label>
//           <Select name="day" value={formData.day} onChange={handleChange}>
//             {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
//               <SelectItem key={day} value={day}>{day}</SelectItem>
//             ))}
//           </Select>
//         </div>
//         <Textarea name="tasks" value={formData.tasks} onChange={handleChange} placeholder="Tasks/Activities for the Day" />
//         <Textarea name="goals" value={formData.goals} onChange={handleChange} placeholder="What are your goals for today?" />
//         <Textarea name="highlights" value={formData.highlights} onChange={handleChange} placeholder="What were the highlights of your day?" />
//         <Textarea name="challenges" value={formData.challenges} onChange={handleChange} placeholder="What challenges did you face?" />
//         <div className="flex space-x-4">
//           <Button type="submit">Submit</Button>
//           <Button type="button" onClick={handleReset} variant="secondary">Reset</Button>
//         </div>
//       </form>

//       <h2 className="text-xl font-semibold mt-8 mb-4">Journal Entries</h2>
//       <div className="space-y-4">
//         {entries.map((entry, index) => (
//           <div key={index} className="border p-4 rounded-lg shadow-sm">
//             <p><strong>Date:</strong> {entry.date}</p>
//             <p><strong>Day:</strong> {entry.day}</p>
//             <p><strong>Tasks:</strong> {entry.tasks}</p>
//             <p><strong>Goals:</strong> {entry.goals}</p>
//             <p><strong>Highlights:</strong> {entry.highlights}</p>
//             <p><strong>Challenges:</strong> {entry.challenges}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;