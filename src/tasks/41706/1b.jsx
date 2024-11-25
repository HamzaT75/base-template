import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Predefined categories and payment methods
const categories = ["Food", "Transport", "Utilities", "Entertainment", "Other"];
const paymentMethods = ["Cash", "Credit Card", "Debit Card"];

// Validation functions
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString) && !isNaN(Date.parse(dateString));
};

const isValidDescription = (description) => {
  const regex = /^[a-zA-Z0-9\s.,!?]{1,100}$/;
  return regex.test(description);
};

const isValidAmount = (amount) => {
  return !isNaN(amount) && parseFloat(amount) > 0;
};

const ExpenseForm = ({ onAddExpense, monthlyBudget, setMonthlyBudget }) => {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!isValidDate(date)) newErrors.date = "Invalid date format (YYYY-MM-DD)";
    if (!category) newErrors.category = "Please select a category";
    if (!isValidDescription(description)) newErrors.description = "Invalid description";
    if (!isValidAmount(amount)) newErrors.amount = "Invalid amount";
    if (!paymentMethod) newErrors.paymentMethod = "Please select a payment method";
    if (!isValidAmount(monthlyBudget)) newErrors.monthlyBudget = "Invalid monthly budget";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddExpense({ date, category, description, amount: parseFloat(amount).toFixed(2), paymentMethod });
      setDate("");
      setCategory("");
      setDescription("");
      setAmount("");
      setPaymentMethod("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={errors.date ? "border-red-500" : ""}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>
      <div>
        <Label htmlFor="category">Expense Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className={errors.category ? "border-red-500" : ""}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>
      <div>
        <Label htmlFor="amount">Amount Spent</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
      </div>
      <div>
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className={errors.paymentMethod ? "border-red-500" : ""}>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}
      </div>
      <div>
        <Label htmlFor="monthlyBudget">Monthly Budget Limit</Label>
        <Input
          id="monthlyBudget"
          type="number"
          step="0.01"
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(e.target.value)}
          className={errors.monthlyBudget ? "border-red-500" : ""}
        />
        {errors.monthlyBudget && <p className="text-red-500 text-sm">{errors.monthlyBudget}</p>}
      </div>
      <Button type="submit">Add Expense</Button>
    </form>
  );
};

const ExpenseList = ({ expenses }) => (
  <div className="space-y-4">
    {expenses.map((expense, index) => (
      <Card key={index}>
        <CardHeader>
          <CardTitle>{expense.description}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Date: {expense.date}</p>
          <p>Category: {expense.category}</p>
          <p>Amount: ${expense.amount}</p>
          <p>Payment Method: {expense.paymentMethod}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [balanceRemaining, setBalanceRemaining] = useState(0);

  useEffect(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const remaining = parseFloat(monthlyBudget) - totalExpenses;
    setBalanceRemaining(isNaN(remaining) ? 0 : remaining.toFixed(2));
  }, [expenses, monthlyBudget]);

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Personal Budget Tracker</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm onAddExpense={addExpense} monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget} />
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Monthly Budget: ${parseFloat(monthlyBudget).toFixed(2)}</p>
          <p>Balance Remaining: ${balanceRemaining}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseList expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  );
}