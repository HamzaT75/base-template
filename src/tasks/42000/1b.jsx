import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const categories = ["Food", "Transport", "Shopping", "Utilities", "Miscellaneous"];

function ExpenseItem({ expense, onDelete }) {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <div>
        <span className="font-semibold">{expense.category}: </span>
        <span>${expense.amount}</span>
      </div>
      <Button variant="destructive" size="sm" onClick={() => onDelete(expense.id)}>
        Delete
      </Button>
    </div>
  );
}

export default function App() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setBalance(income - totalExpenses);
  }, [income, expenses]);

  const handleAddIncome = () => {
    setIncome(parseFloat(income) || 0);
  };

  const handleAddExpense = () => {
    if (category && expenseAmount) {
      const newExpense = {
        id: Date.now(),
        category,
        amount: parseFloat(expenseAmount),
      };
      setExpenses([...expenses, newExpense]);
      setCategory("");
      setExpenseAmount("");
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Budget Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="income">Enter Income</Label>
              <div className="flex space-x-2">
                <Input
                  id="income"
                  type="number"
                  placeholder="e.g., 5000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
                <Button onClick={handleAddIncome}>Add Income</Button>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Select Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Choose Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expenseAmount">Enter Expense Amount</Label>
              <div className="flex space-x-2">
                <Input
                  id="expenseAmount"
                  type="number"
                  placeholder="e.g., 300"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Expense List:</h3>
              {expenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>

            <div
              className={`text-lg font-bold ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Remaining Balance: ${balance.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}