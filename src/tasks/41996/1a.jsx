// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { CalendarIcon, PlusIcon, TrashIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";

// const BirthdayList = ({ birthdays, onDelete, showDelete = true }) => {
//   return (
//     <ul className="space-y-2">
//       {birthdays.map((birthday) => (
//         <li key={birthday.id} className="flex items-center justify-between">
//           <div>
//             <span className="font-semibold">{birthday.name}</span>
//             <span className="ml-2 text-sm text-gray-500">
//               {birthday.daysUntil} days ({birthday.date})
//             </span>
//           </div>
//           {showDelete && (
//             <Button variant="ghost" size="sm" onClick={() => onDelete(birthday.id)}>
//               <TrashIcon className="h-4 w-4" />
//             </Button>
//           )}
//         </li>
//       ))}
//     </ul>
//   );
// };

// const AddBirthdayForm = ({ onSave, onCancel }) => {
//   const [name, setName] = useState("");
//   const [date, setDate] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (name && date) {
//       onSave({ name, date });
//       setName("");
//       setDate("");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="name">Name</Label>
//         <Input
//           id="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="date">Birthday Date</Label>
//         <div className="relative">
//           <Input
//             id="date"
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />
//           <CalendarIcon className="absolute right-2 top-2 h-5 w-5 text-gray-400" />
//         </div>
//       </div>
//       <div className="flex justify-end space-x-2">
//         <Button type="button" variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button type="submit">Save</Button>
//       </div>
//     </form>
//   );
// };

// export default function App() {
//   const [birthdays, setBirthdays] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [upcomingCollapsed, setUpcomingCollapsed] = useState(false);

//   useEffect(() => {
//     const storedBirthdays = JSON.parse(localStorage.getItem("birthdays") || "[]");
//     setBirthdays(storedBirthdays);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("birthdays", JSON.stringify(birthdays));
//   }, [birthdays]);

//   const addBirthday = (newBirthday) => {
//     const id = Date.now().toString();
//     setBirthdays([...birthdays, { ...newBirthday, id }]);
//     setShowAddForm(false);
//   };

//   const deleteBirthday = (id) => {
//     setBirthdays(birthdays.filter((birthday) => birthday.id !== id));
//   };

//   const calculateDaysUntil = (dateString) => {
//     const today = new Date();
//     const birthdayDate = new Date(dateString);
//     birthdayDate.setFullYear(today.getFullYear());
//     if (birthdayDate < today) {
//       birthdayDate.setFullYear(today.getFullYear() + 1);
//     }
//     const diffTime = Math.abs(birthdayDate - today);
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const sortedBirthdays = birthdays
//     .map((birthday) => ({
//       ...birthday,
//       daysUntil: calculateDaysUntil(birthday.date),
//     }))
//     .sort((a, b) => a.daysUntil - b.daysUntil);

//   const upcomingBirthdays = sortedBirthdays.filter(
//     (birthday) => birthday.daysUntil <= 7
//   );

//   return (
//     <div className="container mx-auto p-4 max-w-md">
//       {showAddForm ? (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowAddForm(false)}
//                 className="mr-2"
//               >
//                 <ChevronLeftIcon className="h-5 w-5" />
//               </Button>
//               Add Birthday
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <AddBirthdayForm
//               onSave={addBirthday}
//               onCancel={() => setShowAddForm(false)}
//             />
//           </CardContent>
//         </Card>
//       ) : (
//         <>
//           <Card className="mb-4">
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 Birthday Reminder
//                 <Button onClick={() => setShowAddForm(true)}>
//                   <PlusIcon className="h-5 w-5" />
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <h2 className="text-lg font-semibold mb-2">Upcoming Reminders</h2>
//               {upcomingBirthdays.length > 0 ? (
//                 <BirthdayList
//                   birthdays={upcomingBirthdays}
//                   onDelete={deleteBirthday}
//                   showDelete={false}
//                 />
//               ) : (
//                 <p className="text-gray-500">No upcoming birthdays</p>
//               )}
//             </CardContent>
//           </Card>

//           <Collapsible open={!upcomingCollapsed} onOpenChange={setUpcomingCollapsed}>
//             <Card>
//               <CardHeader>
//                 <CollapsibleTrigger asChild>
//                   <CardTitle className="flex items-center justify-between cursor-pointer">
//                     All Birthdays
//                     <Button variant="ghost" size="sm">
//                       {upcomingCollapsed ? "Expand" : "Collapse"}
//                     </Button>
//                   </CardTitle>
//                 </CollapsibleTrigger>
//               </CardHeader>
//               <CollapsibleContent>
//                 <CardContent>
//                   {sortedBirthdays.length > 0 ? (
//                     <BirthdayList
//                       birthdays={sortedBirthdays}
//                       onDelete={deleteBirthday}
//                     />
//                   ) : (
//                     <p className="text-gray-500">No birthdays added yet</p>
//                   )}
//                 </CardContent>
//               </CollapsibleContent>
//             </Card>
//           </Collapsible>
//         </>
//       )}
//     </div>
//   );
// }