// import React, { useState } from 'react';
// import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

// function App() {
//   const [contacts, setContacts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [form, setForm] = useState({ name: '', phone: '', email: '' });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (form.name && form.phone && form.email) {
//       setContacts([...contacts, { ...form, id: Date.now() }]);
//       setForm({ name: '', phone: '', email: '' });
//     }
//   };

//   const handleDelete = (id) => {
//     setContacts(contacts.filter(contact => contact.id !== id));
//   };

//   const filteredContacts = contacts
//     .filter(contact => 
//       contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.phone.includes(searchTerm) ||
//       contact.email.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => a.name.localeCompare(b.name));

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle>Contact Organizer</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Button onClick={() => document.getElementById('addContactForm').scrollIntoView({ behavior: 'smooth' })} className="mb-4">Add Contact</Button>
//           <Input 
//             placeholder="Search contacts..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="mb-4"
//           />
//           {filteredContacts.map(contact => (
//             <div key={contact.id} className="flex justify-between items-center mb-2">
//               <div>
//                 <p>{contact.name}</p>
//                 <p className="text-sm text-gray-500">{contact.phone}</p>
//                 <p className="text-sm text-gray-500">{contact.email}</p>
//               </div>
//               <Button variant="destructive" onClick={() => handleDelete(contact.id)}>Delete</Button>
//             </div>
//           ))}
//           <div id="addContactForm" className="mt-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <Input 
//                 type="text" 
//                 placeholder="Name" 
//                 value={form.name}
//                 onChange={(e) => setForm({...form, name: e.target.value})}
//                 required
//               />
//               <Input 
//                 type="tel" 
//                 placeholder="Phone" 
//                 value={form.phone}
//                 onChange={(e) => setForm({...form, phone: e.target.value})}
//                 pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
//                 required
//               />
//               <Input 
//                 type="email" 
//                 placeholder="Email" 
//                 value={form.email}
//                 onChange={(e) => setForm({...form, email: e.target.value})}
//                 required
//               />
//               <div className="flex justify-between">
//                 <Button type="submit">Submit</Button>
//                 <Button type="button" variant="secondary" onClick={() => setForm({ name: '', phone: '', email: '' })}>Clear All</Button>
//               </div>
//             </form>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default App;