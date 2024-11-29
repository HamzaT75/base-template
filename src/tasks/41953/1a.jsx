import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const categories = ["Dairy", "Vegetables", "Bakery", "Fruits", "Meat", "Beverages"];

function AddItemForm({ onAddItem }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName && quantity && category) {
      onAddItem({ itemName, quantity: parseInt(quantity), category });
      setItemName("");
      setQuantity("");
      setCategory("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Item name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
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
      <Button type="submit">Save</Button>
    </form>
  );
}

function ItemList({ items, onToggleBought, onRemoveItem }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={item.bought}
              onCheckedChange={() => onToggleBought(item.id)}
            />
            <span className={item.bought ? "line-through" : ""}>
              {item.itemName} ({item.quantity}) - {item.category}
            </span>
          </div>
          <Button variant="destructive" size="sm" onClick={() => onRemoveItem(item.id)}>
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
}

function BoughtList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          {item.itemName} ({item.quantity}) - {item.category}
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [showBoughtItems, setShowBoughtItems] = useState(false);

  const addItem = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now(), bought: false }]);
  };

  const toggleBought = (id) => {
    setItems(items.map((item) => 
      item.id === id ? { ...item, bought: !item.bought } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const boughtItems = items.filter((item) => item.bought);

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Shopping List App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AddItemForm onAddItem={addItem} />
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Item List</h2>
            <ItemList
              items={items}
              onToggleBought={toggleBought}
              onRemoveItem={removeItem}
            />
          </div>
          
          <Button onClick={() => setShowBoughtItems(!showBoughtItems)}>
            {showBoughtItems ? "Hide" : "Show"} Bought Items
          </Button>
          
          {showBoughtItems && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Bought Items</h2>
              <BoughtList items={boughtItems} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}