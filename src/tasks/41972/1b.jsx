// import React, { useState } from 'react';
// import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectItem } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Calendar } from "@/components/ui/calendar";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// function App() {
//   const [notes, setNotes] = useState([]);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     category: 'Work',
//     createdDate: new Date(),
//     lastModifiedDate: new Date(),
//     priority: 'Medium'
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDateChange = (name, date) => {
//     setFormData(prev => ({ ...prev, [name]: date }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.title.length >= 3 && formData.title.length <= 100) {
//       setNotes([...notes, { ...formData, id: Date.now() }]);
//       handleReset();
//     } else {
//       alert('Title must be between 3 and 100 characters.');
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       title: '',
//       content: '',
//       category: 'Work',
//       createdDate: new Date(),
//       lastModifiedDate: new Date(),
//       priority: 'Medium'
//     });
//   };

//   const deleteNote = (id) => {
//     setNotes(notes.filter(note => note.id !== id));
//   };

//   return (
//     <div className="container mx-auto p-4 sm:p-6">
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Create New Note</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Label htmlFor="title">Note Title</Label>
//               <Input 
//                 id="title" 
//                 name="title"
//                 placeholder="Enter the note's title" 
//                 value={formData.title} 
//                 onChange={handleChange} 
//                 required 
//                 minLength={3} 
//                 maxLength={100}
//               />
//             </div>
//             <div>
//               <Label htmlFor="content">Content</Label>
//               <Textarea 
//                 id="content" 
//                 name="content"
//                 value={formData.content} 
//                 onChange={handleChange} 
//                 placeholder="Write your note here..."
//               />
//             </div>
//             <div>
//               <Label htmlFor="category">Category</Label>
//               <Select id="category" name="category" value={formData.category} onChange={handleChange}>
//                 <SelectItem value="Work">Work</SelectItem>
//                 <SelectItem value="Personal">Personal</SelectItem>
//                 <SelectItem value="Hobbies">Hobbies</SelectItem>
//                 <SelectItem value="Others">Others</SelectItem>
//               </Select>
//             </div>
//             <div>
//               <Label>Created Date</Label>
//               <Calendar 
//                 selected={formData.createdDate} 
//                 onChange={(date) => handleDateChange('createdDate', date)} 
//               />
//             </div>
//             <div>
//               <Label>Last Modified Date</Label>
//               <Calendar 
//                 selected={formData.lastModifiedDate} 
//                 onChange={(date) => handleDateChange('lastModifiedDate', date)} 
//               />
//             </div>
//             <div>
//               <Label>Priority</Label>
//               <RadioGroup value={formData.priority} onValueChange={(value) => handleChange({target: {name: 'priority', value}})}>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="Low" id="low" />
//                   <Label htmlFor="low">Low</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="Medium" id="medium" />
//                   <Label htmlFor="medium">Medium</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="High" id="high" />
//                   <Label htmlFor="high">High</Label>
//                 </div>
//               </RadioGroup>
//             </div>
//             <div className="flex space-x-2">
//               <Button type="submit">Submit</Button>
//               <Button type="button" onClick={handleReset}>Reset</Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       <div className="grid gap-4 sm:grid-cols-2">
//         {notes.map((note) => (
//           <Card key={note.id}>
//             <CardContent className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-lg font-semibold">{note.title}</h2>
//                 <p>{note.content}</p>
//                 <small>Category: {note.category}</small>
//                 <br />
//                 <small>Created: {note.createdDate.toLocaleDateString()}</small>
//                 <br />
//                 <small>Last Modified: {note.lastModifiedDate.toLocaleDateString()}</small>
//                 <br />
//                 <small>Priority: {note.priority}</small>
//               </div>
//               <Button variant="destructive" size="icon" onClick={() => deleteNote(note.id)}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;