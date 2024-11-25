import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { format } from 'date-fns';

// Predefined categories and payment methods
const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];
const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Digital Wallet'];

function BudgetTracker() {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    description: '',
    amount: '',
    paymentMethod: '',
    budgetLimit: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate and add new entry
  const addEntry = () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      setEntries(prev => [...prev, { ...formData, balance: calculateBalance(formData, prev) }]);
      setFormData({
        date: '',
        category: '',
        description: '',
        amount: '',
        paymentMethod: '',
        budgetLimit: formData.budgetLimit,
      });
    } else {
      alert(Object.values(errors).join('\n'));
    }
  };

  // Simple validation function
  const validateForm = (data) => {
    let errors = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) errors.date = "Invalid date format.";
    if (!categories.includes(data.category)) errors.category = "Select a valid category.";
    if (data.description.length > 100 || /[^a-zA-Z0-9\s.,!?]/.test(data.description)) errors.description = "Invalid description.";
    if (!/^\d+(\.\d{1,2})?$/.test(data.amount) || parseFloat(data.amount) <= 0) errors.amount = "Invalid amount.";
    if (!paymentMethods.includes(data.paymentMethod)) errors.paymentMethod = "Select a valid payment method.";
    if (!/^\d+(\.\d{1,2})?$/.test(data.budgetLimit) || parseFloat(data.budgetLimit) <= 0) errors.budgetLimit = "Invalid budget limit.";
    return errors;
  };

  // Calculate remaining balance
  const calculateBalance = (currentEntry, previousEntries) => {
    const totalSpent = previousEntries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0) + parseFloat(currentEntry.amount);
    return parseFloat(currentEntry.budgetLimit) - totalSpent;
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Personal Budget Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              placeholder="YYYY-MM-DD" 
              required 
            />
            <Select name="category" value={formData.category} onChange={handleChange}>
              <SelectItem value="">Choose Category</SelectItem>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </Select>
            <Input 
              type="text" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Description" 
              maxLength="100" 
            />
            <Input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              placeholder="Amount Spent" 
              step="0.01" 
            />
            <Select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <SelectItem value="">Payment Method</SelectItem>
              {paymentMethods.map(method => <SelectItem key={method} value={method}>{method}</SelectItem>)}
            </Select>
            <Input 
              type="number" 
              name="budgetLimit" 
              value={formData.budgetLimit} 
              onChange={handleChange} 
              placeholder="Monthly Budget Limit" 
              step="0.01" 
            />
            <Button onClick={addEntry}>Add Entry</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4">
        {entries.map((entry, index) => (
          <Card key={index} className="mb-2">
            <CardContent>
              <p><strong>Date:</strong> {entry.date}</p>
              <p><strong>Category:</strong> {entry.category}</p>
              <p><strong>Description:</strong> {entry.description}</p>
              <p><strong>Spent:</strong> ${parseFloat(entry.amount).toFixed(2)}</p>
              <p><strong>Method:</strong> {entry.paymentMethod}</p>
              <p><strong>Budget:</strong> ${parseFloat(entry.budgetLimit).toFixed(2)}</p>
              <p><strong>Balance:</strong> ${entry.balance.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return <BudgetTracker />;
}