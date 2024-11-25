import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for initial stocks
const initialStocks = [
  {
    id: 1,
    name: "Apple Inc.",
    industry: "Technology",
    shares: 100,
    purchasePrice: 150,
    purchaseDate: "2023-01-01",
    dividends: [
      { amount: 0.22, frequency: "Quarterly", paymentDate: "2023-03-15", amountReceived: 22 },
      { amount: 0.22, frequency: "Quarterly", paymentDate: "2023-06-15", amountReceived: 22 },
    ],
    notes: "Strong performer in my portfolio",
  },
  {
    id: 2,
    name: "Microsoft Corporation",
    industry: "Technology",
    shares: 50,
    purchasePrice: 200,
    purchaseDate: "2023-02-15",
    dividends: [
      { amount: 0.68, frequency: "Quarterly", paymentDate: "2023-03-09", amountReceived: 34 },
      { amount: 0.68, frequency: "Quarterly", paymentDate: "2023-06-08", amountReceived: 34 },
    ],
    notes: "Consistent dividend growth",
  },
];

export default function App() {
  const [stocks, setStocks] = useState(initialStocks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [isAddingStock, setIsAddingStock] = useState(false);

  // Filter stocks based on search term
  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total dividends
  const calculateTotalDividends = (period) => {
    const now = new Date();
    const periodStart = new Date(now.setMonth(now.getMonth() - period));

    return stocks.reduce((total, stock) => {
      return (
        total +
        stock.dividends.reduce((stockTotal, dividend) => {
          const paymentDate = new Date(dividend.paymentDate);
          if (paymentDate >= periodStart) {
            return stockTotal + dividend.amountReceived;
          }
          return stockTotal;
        }, 0)
      );
    }, 0);
  };

  // Add new stock
  const addStock = (newStock) => {
    setStocks([...stocks, { ...newStock, id: stocks.length + 1, dividends: [] }]);
  };

  // Edit existing stock
  const editStock = (updatedStock) => {
    setStocks(stocks.map((stock) => (stock.id === updatedStock.id ? updatedStock : stock)));
  };

  // Remove stock
  const removeStock = (id) => {
    setStocks(stocks.filter((stock) => stock.id !== id));
  };

  // Add dividend to stock
  const addDividend = (stockId, newDividend) => {
    setStocks(
      stocks.map((stock) =>
        stock.id === stockId
          ? { ...stock, dividends: [...stock.dividends, newDividend] }
          : stock
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Stock Management App</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStocks.map((stock) => (
          <StockCard
            key={stock.id}
            stock={stock}
            onEdit={() => setSelectedStock(stock)}
            onRemove={() => removeStock(stock.id)}
            onAddDividend={(dividend) => addDividend(stock.id, dividend)}
          />
        ))}
      </div>
      <Button onClick={() => setIsAddingStock(true)} className="mt-4">
        Add New Stock
      </Button>
      <DividendSummary stocks={stocks} />
      <StockForm
        isOpen={isAddingStock}
        onClose={() => setIsAddingStock(false)}
        onSubmit={addStock}
      />
      <StockForm
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)}
        onSubmit={editStock}
        initialData={selectedStock}
      />
    </div>
  );
}

function StockCard({ stock, onEdit, onRemove, onAddDividend }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{stock.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Industry: {stock.industry}</p>
        <p>Shares: {stock.shares}</p>
        <p>Purchase Price: ${stock.purchasePrice}</p>
        <p>Purchase Date: {stock.purchaseDate}</p>
        <p>Notes: {stock.notes}</p>
        <h4 className="font-semibold mt-2">Dividends</h4>
        <ul>
          {stock.dividends.map((dividend, index) => (
            <li key={index}>
              ${dividend.amount} ({dividend.frequency}) - Received: ${dividend.amountReceived} on{" "}
              {dividend.paymentDate}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Button onClick={onEdit} className="mr-2">
            Edit
          </Button>
          <Button onClick={onRemove} variant="destructive">
            Remove
          </Button>
        </div>
        <DividendForm onSubmit={onAddDividend} />
      </CardContent>
    </Card>
  );
}

function StockForm({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      industry: "",
      shares: "",
      purchasePrice: "",
      purchaseDate: "",
      notes: "",
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Stock" : "Add New Stock"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="industry" className="text-right">
                Industry
              </Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shares" className="text-right">
                Shares
              </Label>
              <Input
                id="shares"
                name="shares"
                type="number"
                value={formData.shares}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchasePrice" className="text-right">
                Purchase Price
              </Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchaseDate" className="text-right">
                Purchase Date
              </Label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">{initialData ? "Update" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DividendForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    amount: "",
    frequency: "Quarterly",
    paymentDate: "",
    amountReceived: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      amount: "",
      frequency: "Quarterly",
      paymentDate: "",
      amountReceived: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h4 className="font-semibold mb-2">Add Dividend</h4>
      <div className="grid grid-cols-2 gap-2">
        <Input
          name="amount"
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />
        <Select
          name="frequency"
          value={formData.frequency}
          onValueChange={(value) => setFormData({ ...formData, frequency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Quarterly">Quarterly</SelectItem>
            <SelectItem value="Annually">Annually</SelectItem>
          </SelectContent>
        </Select>
        <Input
          name="paymentDate"
          type="date"
          placeholder="Payment Date"
          value={formData.paymentDate}
          onChange={handleChange}
        />
        <Input
          name="amountReceived"
          type="number"
          placeholder="Amount Received"
          value={formData.amountReceived}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" className="mt-2">
        Add Dividend
      </Button>
    </form>
  );
}

function DividendSummary({ stocks }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Dividend Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            Total Dividends (Last Month): ${calculateTotalDividends(stocks, 1).toFixed(2)}
          </TabsContent>
          <TabsContent value="quarterly">
            Total Dividends (Last Quarter): ${calculateTotalDividends(stocks, 3).toFixed(2)}
          </TabsContent>
          <TabsContent value="yearly">
            Total Dividends (Last Year): ${calculateTotalDividends(stocks, 12).toFixed(2)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function calculateTotalDividends(stocks, months) {
  const now = new Date();
  const startDate = new Date(now.setMonth(now.getMonth() - months));

  return stocks.reduce((total, stock) => {
    return (
      total +
      stock.dividends.reduce((stockTotal, dividend) => {
        const paymentDate = new Date(dividend.paymentDate);
        if (paymentDate >= startDate) {
          return stockTotal + parseFloat(dividend.amountReceived);
        }
        return stockTotal;
      }, 0)
    );
  }, 0);
}