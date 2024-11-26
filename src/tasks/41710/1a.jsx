// import React, { useState, useEffect } from 'react';
// import {
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle,
//   Button,
//   Input,
//   Textarea,
//   Switch,
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui";

// // EventForm component for creating and editing events
// function EventForm({ event = {}, onSubmit, onCancel }) {
//   const [formData, setFormData] = useState({
//     title: event.title || '',
//     description: event.description || '',
//     location: event.location || '',
//     dateTime: event.dateTime || new Date().toISOString().slice(0, 16),
//     isPublic: event.isPublic || false,
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({ ...formData, id: event.id || Date.now() });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <Input 
//         value={formData.title} 
//         onChange={e => setFormData({...formData, title: e.target.value})} 
//         placeholder="Event Title" 
//         required 
//       />
//       <Textarea 
//         value={formData.description} 
//         onChange={e => setFormData({...formData, description: e.target.value})} 
//         placeholder="Description" 
//       />
//       <Input 
//         value={formData.location} 
//         onChange={e => setFormData({...formData, location: e.target.value})} 
//         placeholder="Location" 
//       />
//       <Input 
//         type="datetime-local" 
//         value={formData.dateTime} 
//         onChange={e => setFormData({...formData, dateTime: e.target.value})} 
//       />
//       <div className="flex items-center space-x-2">
//         <Switch 
//           checked={formData.isPublic} 
//           onCheckedChange={checked => setFormData({...formData, isPublic: checked})} 
//         />
//         <span>{formData.isPublic ? 'Public' : 'Private'}</span>
//       </div>
//       <Button type="submit">Save</Button>
//       <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
//     </form>
//   );
// }

// // Main App component
// export default function App() {
//   const [events, setEvents] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingEvent, setEditingEvent] = useState(null);

//   // Function to add or update an event
//   const handleEventSubmit = (eventData) => {
//     if (editingEvent) {
//       setEvents(events.map(e => e.id === eventData.id ? eventData : e));
//     } else {
//       setEvents([...events, eventData]);
//     }
//     setShowForm(false);
//     setEditingEvent(null);
//   };

//   // Function to delete an event
//   const deleteEvent = (id) => {
//     setEvents(events.filter(event => event.id !== id));
//   };

//   // Function to duplicate an event
//   const duplicateEvent = (event) => {
//     setEditingEvent({...event, id: null, title: `Copy of ${event.title}`});
//     setShowForm(true);
//   };

//   // Filter upcoming events for dashboard
//   const upcomingEvents = events.filter(event => 
//     new Date(event.dateTime) > new Date() && event.isPublic
//   );

//   return (
//     <div className="container mx-auto p-4 sm:p-8">
//       <h1 className="text-3xl font-bold mb-4">Event Planner</h1>
//       <Button onClick={() => {setShowForm(true); setEditingEvent(null);}}>
//         Create New Event
//       </Button>

//       <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {upcomingEvents.map(event => (
//           <Card key={event.id}>
//             <CardHeader>
//               <CardTitle>{event.title}</CardTitle>
//               <CardDescription>{new Date(event.dateTime).toLocaleString()}</CardDescription>
//             </CardHeader>
//             <CardContent>{event.description}</CardContent>
//             <CardFooter className="flex justify-between">
//               <Button onClick={() => {setEditingEvent(event); setShowForm(true);}}>Edit</Button>
//               <Button onClick={() => deleteEvent(event.id)} variant="destructive">Delete</Button>
//               <Button onClick={() => duplicateEvent(event)}>Duplicate</Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       <Dialog open={showForm} onOpenChange={setShowForm}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editingEvent ? "Edit Event" : "New Event"}</DialogTitle>
//           </DialogHeader>
//           <EventForm 
//             event={editingEvent} 
//             onSubmit={handleEventSubmit} 
//             onCancel={() => {setShowForm(false); setEditingEvent(null);}} 
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
