// import React, { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectItem } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// function App() {
//   const [income, setIncome] = useState(0);
//   const [expenses, setExpenses] = useState([]);
//   const [category, setCategory] = useState('');
//   const [expenseAmount, setExpenseAmount] = useState('');

//   const addIncome = () => {
//     const incomeValue = parseFloat(document.getElementById('income').value);
//     if (!isNaN(incomeValue)) {
//       setIncome(incomeValue);
//     }
//   };

//   const addExpense = () => {
//     if (category && expenseAmount) {
//       setExpenses(prev => [...prev, { category, amount: parseFloat(expenseAmount), id: Date.now() }]);
//       setCategory('');
//       setExpenseAmount('');
//     }
//   };

//   const deleteExpense = (id) => {
//     setExpenses(prev => prev.filter(expense => expense.id !== id));
//   };

//   const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
//   const remainingBalance = income - totalExpenses;
//   const balanceColor = remainingBalance >= 0 ? 'text-green-500' : 'text-red-500';

//   return (
//     <div className="flex flex-col items-center p-4 space-y-4 sm:w-full md:w-3/4 lg:w-1/2 mx-auto">
//       <Card>
//         <CardHeader>
//           <CardTitle>Budget Planner</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div>
//               <Input 
//                 id="income" 
//                 type="number" 
//                 placeholder="e.g., 5000" 
//                 label="Enter Income" 
//               />
//               <Button onClick={addIncome} className="mt-2 w-full">Add Income</Button>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:space-x-4">
//               <Select value={category} onValueChange={setCategory}>
//                 <SelectItem value="">Choose Category</SelectItem>
//                 <SelectItem value="Food">Food</SelectItem>
//                 <SelectItem value="Transport">Transport</SelectItem>
//                 <SelectItem value="Shopping">Shopping</SelectItem>
//                 <SelectItem value="Utilities">Utilities</SelectItem>
//                 <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
//               </Select>
//               <Input 
//                 type="number" 
//                 value={expenseAmount} 
//                 onChange={(e) => setExpenseAmount(e.target.value)} 
//                 placeholder="e.g., 300" 
//                 label="Enter Expense Amount" 
//               />
//             </div>
//             <Button onClick={addExpense} className="mt-2 w-full">Add Expense</Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Expenses</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {expenses.map(expense => (
//             <div key={expense.id} className="flex justify-between items-center border-b pb-2 mb-2">
//               <span>{expense.category} - ${expense.amount}</span>
//               <Button variant="destructive" onClick={() => deleteExpense(expense.id)}>Delete</Button>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       <div className={`text-2xl font-bold ${balanceColor}`}>
//         Remaining Balance: ${remainingBalance.toFixed(2)}
//       </div>
//     </div>
//   );
// }

// export default App;