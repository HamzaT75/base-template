// import React, { useState } from 'react';
// import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui";
// import { Star, StarFill } from 'react-bootstrap-icons';


// function FeedbackForm() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [rating, setRating] = useState(0);
//   const [comments, setComments] = useState('');
//   const [submissions, setSubmissions] = useState([]);
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     let tempErrors = {};
//     tempErrors.name = name ? "" : "Name is required.";
//     tempErrors.email = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email) ? "" : "Email is not valid.";
//     tempErrors.rating = rating > 0 ? "" : "Please rate your experience.";
//     setErrors(tempErrors);
//     return Object.values(tempErrors).every(x => x === "");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       setSubmissions([...submissions, { name, email, rating, comments }]);
//       resetForm();
//     }
//   };

//   const resetForm = () => {
//     setName('');
//     setEmail('');
//     setRating(0);
//     setComments('');
//     setErrors({});
//   };

//   const handleDelete = (index) => {
//     setSubmissions(submissions.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Feedback Form</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <Input 
//                 label="Name" 
//                 value={name} 
//                 onChange={(e) => setName(e.target.value)} 
//                 className="mb-2"
//                 error={errors.name}
//               />
//             </div>
//             <div className="mb-4">
//               <Input 
//                 label="Email" 
//                 type="email" 
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 className="mb-2"
//                 error={errors.email}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2">Rate Your Experience</label>
//               {[1, 2, 3, 4, 5].map(star => (
//                 <StarFill 
//                   key={star} 
//                   onClick={() => setRating(star)} 
//                   className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer inline mr-2`}
//                 />
//               ))}
//               {errors.rating && <p className="text-red-500 text-xs">{errors.rating}</p>}
//             </div>
//             <div className="mb-4">
//               <Textarea 
//                 label="Suggestions or Comments" 
//                 value={comments} 
//                 onChange={(e) => setComments(e.target.value)} 
//                 className="mb-2"
//               />
//             </div>
//             <Button type="submit">Submit</Button>
//             <Button type="button" onClick={resetForm} className="ml-2">Reset</Button>
//           </form>
//         </CardContent>
//       </Card>

//       <div className="grid gap-4">
//         {submissions.map((submission, index) => (
//           <Card key={index}>
//             <CardContent className="p-4">
//               <p><strong>Name:</strong> {submission.name}</p>
//               <p><strong>Email:</strong> {submission.email}</p>
//               <p><strong>Rating:</strong> {submission.rating}</p>
//               <p><strong>Comments:</strong> {submission.comments}</p>
//               <Button onClick={() => handleDelete(index)} variant="destructive">Delete</Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   return <FeedbackForm />;
// }