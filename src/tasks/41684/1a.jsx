import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Expense form component
const ExpenseForm = ({ addExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    name: "",
    quantity: "",
    date: "",
  });

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense(expense);
    setExpense({ category: "", amount: "", name: "", quantity: "", date: "" });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" value={expense.category} onValueChange={(value) => setExpense({ ...expense, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {["Housing", "Transportation", "Food", "Utilities", "Healthcare"].map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input type="number" name="amount" value={expense.amount} onChange={handleChange} placeholder="Enter amount" />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input type="text" name="name" value={expense.name} onChange={handleChange} placeholder="Enter expense name" />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input type="number" name="quantity" value={expense.quantity} onChange={handleChange} placeholder="Enter quantity" />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" name="date" value={expense.date} onChange={handleChange} />
          </div>
          <Button type="submit">Add Expense</Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Expense list component
const ExpenseList = ({ expenses, setSelectedExpense, searchTerm, setSearchTerm }) => {
  const filteredExpenses = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Expense List</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search expenses"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <ul className="space-y-2">
          {filteredExpenses.map((expense, index) => (
            <li
              key={index}
              onClick={() => setSelectedExpense(expense)}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              {expense.name} - ${expense.amount}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// Detail view component
const DetailView = ({ expense }) => {
  if (!expense) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Expense Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Category:</strong> {expense.category}</p>
        <p><strong>Amount:</strong> ${expense.amount}</p>
        <p><strong>Name:</strong> {expense.name}</p>
        <p><strong>Quantity:</strong> {expense.quantity}</p>
        <p><strong>Date:</strong> {expense.date}</p>
      </CardContent>
    </Card>
  );
};

// Summary view component
const SummaryView = ({ expenses }) => {
  const categoryCounts = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Main App component
export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Expense Management App</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <ExpenseForm addExpense={addExpense} />
          <ExpenseList
            expenses={expenses}
            setSelectedExpense={setSelectedExpense}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div>
          <DetailView expense={selectedExpense} />
          <SummaryView expenses={expenses} />
        </div>
      </div>
    </div>
  );
}