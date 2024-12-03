// import React, { useState, useMemo } from 'react';
// import { Button, Input, Textarea, Select, SelectItem, Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui";
// import { useForm, Controller } from "react-hook-form";
// import { cn } from "@/lib/utils";

// export default function App() {
//   const [applications, setApplications] = useState([]);
//   const { control, handleSubmit, reset, formState: { errors } } = useForm();

//   const onSubmit = (data) => {
//     setApplications([...applications, { ...data, id: Date.now() }]);
//     reset();
//   };

//   const deleteApplication = (id) => {
//     setApplications(applications.filter(app => app.id !== id));
//   };

//   const positions = useMemo(() => [
//     'Software Engineer',
//     'Product Manager',
//     'UI/UX Designer',
//     'Data Analyst',
//     'Marketing Specialist'
//   ], []);

//   return (
//     <div className="container mx-auto p-4 sm:p-8">
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Job Application Form</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="grid gap-4 mb-4">
//               <Controller
//                 name="name"
//                 control={control}
//                 rules={{ required: 'Name is required' }}
//                 render={({ field }) => (
//                   <Input 
//                     label="Name"
//                     placeholder="Full Name"
//                     className={cn("w-full", errors.name && "border-red-500")}
//                     {...field} 
//                   />
//                 )}
//               />
//               {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

//               <Controller
//                 name="email"
//                 control={control}
//                 rules={{ 
//                   required: 'Email is required', 
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: "Invalid email address"
//                   }
//                 }}
//                 render={({ field }) => (
//                   <Input 
//                     label="Email"
//                     placeholder="email@example.com"
//                     className={cn("w-full", errors.email && "border-red-500")}
//                     {...field} 
//                   />
//                 )}
//               />
//               {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

//               <Controller
//                 name="phoneNumber"
//                 control={control}
//                 rules={{ required: 'Phone number is required' }}
//                 render={({ field }) => (
//                   <Input 
//                     label="Phone Number"
//                     placeholder="123-456-7890"
//                     className={cn("w-full", errors.phoneNumber && "border-red-500")}
//                     {...field} 
//                   />
//                 )}
//               />
//               {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}

//               <Controller
//                 name="coverLetter"
//                 control={control}
//                 rules={{ required: 'Cover letter is required' }}
//                 render={({ field }) => (
//                   <Textarea 
//                     label="Cover Letter"
//                     placeholder="Write your cover letter here..."
//                     className={cn("w-full", errors.coverLetter && "border-red-500")}
//                     {...field} 
//                   />
//                 )}
//               />
//               {errors.coverLetter && <p className="text-sm text-red-500">{errors.coverLetter.message}</p>}

//               <Controller
//                 name="position"
//                 control={control}
//                 rules={{ required: 'Position is required' }}
//                 render={({ field }) => (
//                   <Select 
//                     label="Position Applied For"
//                     className={cn("w-full", errors.position && "border-red-500")}
//                     {...field}
//                   >
//                     {positions.map(position => <SelectItem key={position} value={position}>{position}</SelectItem>)}
//                   </Select>
//                 )}
//               />
//               {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
//             </div>
//             <div className="flex gap-2">
//               <Button type="submit">Submit</Button>
//               <Button type="button" onClick={reset} variant="secondary">Reset</Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Submitted Applications</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {applications.map(app => (
//             <div key={app.id} className="flex justify-between items-center border-b pb-2 mb-2">
//               <div>{app.name} - {app.position}</div>
//               <Button variant="destructive" onClick={() => deleteApplication(app.id)}>Delete</Button>
//             </div>
//           ))}
//           {applications.length === 0 && <p>No applications yet.</p>}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }