// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { cn } from "@/lib/utils";
// import { format } from 'date-fns';

// function App() {
//   const [formData, setFormData] = useState({
//     departureCity: '',
//     destinationCity: '',
//     journeyDate: '',
//     departureTime: '',
//     numberOfPassengers: 1,
//     age: '',
//     phoneNo: '',
//     seatNo: '',
//   });

//   const [errors, setErrors] = useState({});
//   const ticketPrice = 100;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     if (!formData.departureCity) newErrors.departureCity = 'Departure city is required';
//     if (!formData.destinationCity) newErrors.destinationCity = 'Destination city is required';
//     if (!formData.journeyDate) newErrors.journeyDate = 'Journey date is required';
//     if (!formData.departureTime) newErrors.departureTime = 'Departure time is required';
//     if (formData.numberOfPassengers < 1) newErrors.numberOfPassengers = 'Must be at least 1';
//     if (!formData.age) newErrors.age = 'Age is required';
//     if (!/^\d{10}$/.test(formData.phoneNo)) newErrors.phoneNo = 'Invalid phone number';
//     if (!formData.seatNo) newErrors.seatNo = 'Seat number is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       alert('Form submitted successfully!');
//       // Here you would typically send data to a server
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       departureCity: '',
//       destinationCity: '',
//       journeyDate: '',
//       departureTime: '',
//       numberOfPassengers: 1,
//       age: '',
//       phoneNo: '',
//       seatNo: '',
//     });
//     setErrors({});
//   };

//   return (
//     <div className="container mx-auto p-4 sm:p-8">
//       <Card className="max-w-lg mx-auto">
//         <CardHeader>
//           <CardTitle>Bus Seat Booking</CardTitle>
//           <CardDescription>Enter your travel details</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             {['departureCity', 'destinationCity', 'journeyDate', 'departureTime', 'numberOfPassengers', 'age', 'phoneNo', 'seatNo'].map(field => (
//               <div key={field} className="mb-4">
//                 <Label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').trim()}</Label>
//                 <Input 
//                   type={field.includes('Date') ? 'date' : (field.includes('No') || field === 'age' || field === 'numberOfPassengers') ? 'number' : 'text'}
//                   id={field}
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   className={cn("mt-1", errors[field] && "border-red-500")}
//                   min={field === 'journeyDate' ? format(new Date(), 'yyyy-MM-dd') : (field === 'numberOfPassengers' ? '1' : undefined)}
//                 />
//                 {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
//               </div>
//             ))}
//             <Button type="submit" className="mr-2">Book Seat</Button>
//             <Button type="button" onClick={handleReset}>Reset</Button>
//           </form>
//         </CardContent>
//       </Card>

//       <Card className="mt-8 max-w-lg mx-auto">
//         <CardHeader>
//           <CardTitle>Booking Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Field</TableHead>
//                 <TableHead>Value</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {Object.entries(formData).map(([key, value]) => (
//                 <TableRow key={key}>
//                   <TableCell>{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
//                   <TableCell>{key === 'journeyDate' ? format(new Date(value), 'PP') : value}</TableCell>
//                 </TableRow>
//               ))}
//               <TableRow>
//                 <TableCell><strong>Total Amount</strong></TableCell>
//                 <TableCell><strong>{formData.numberOfPassengers * ticketPrice}</strong></TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default App;