import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const categories = ['Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare'];

function ExpenseForm({ onAddExpense }) {
  const [expense, setExpense] = useState({
    category: categories[0],
    amount: '',
    name: '',
    quantity: '1',
    date: new Date(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expense.name || !expense.amount) return;
    onAddExpense({ ...expense, date: expense.date.toISOString().split('T')[0] });
    setExpense({ category: categories[0], amount: '', name: '', quantity: '1', date: new Date() });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select id="category" value={expense.category} onChange={e => setExpense({...expense, category: e.target.value})}>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input type="number" id="amount" value={expense.amount} onChange={e => setExpense({...expense, amount: e.target.value})} placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={expense.name} onChange={e => setExpense({...expense, name: e.target.value})} placeholder="Expense Name" />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input type="number" id="quantity" value={expense.quantity} onChange={e => setExpense({...expense, quantity: e.target.value})} placeholder="1" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" value={expense.date.toISOString().split('T')[0]} onChange={e => setExpense({...expense, date: new Date(e.target.value)})} />
            </div>
          </div>
          <Button type="submit">Add Expense</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ExpenseList({ expenses, onSelectExpense }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExpenses = expenses.filter(expense => 
    expense.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <Input 
          type="text" 
          placeholder="Search expenses..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </CardHeader>
      <CardContent>
        {filteredExpenses.map((expense, index) => (
          <div key={index} onClick={() => onSelectExpense(expense)} className="cursor-pointer hover:bg-gray-100 p-2">
            {expense.name} - ${expense.amount}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ExpenseDetail({ expense }) {
  if (!expense) return <p>Select an expense to see details.</p>;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense.name}</CardTitle>
        <CardDescription>Details</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Category:</strong> {expense.category}</p>
        <p><strong>Amount:</strong> ${expense.amount}</p>
        <p><strong>Quantity:</strong> {expense.quantity}</p>
        <p><strong>Date:</strong> {format(new Date(expense.date), 'PP')}</p>
      </CardContent>
    </Card>
  );
}

function SummaryView({ expenses }) {
  const data = useMemo(() => {
    return categories.map(cat => ({
      name: cat,
      count: expenses.filter(e => e.category === cat).length,
    }));
  }, [expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart width={300} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const addExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Management</h1>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <ExpenseForm onAddExpense={addExpense} />
          <ExpenseList expenses={expenses} onSelectExpense={setSelectedExpense} />
        </div>
        <div>
          <ExpenseDetail expense={selectedExpense} />
        </div>
        <div>
          <SummaryView expenses={expenses} />
        </div>
      </div>
    </div>
  );
}