import React, { useState } from 'react';
import { Checkbox, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const equipmentList = [
  { name: "Drill", specs: "18V cordless, 2-speed settings, keyless chuck", rent: 140 },
  { name: "Circular Saw", specs: "1200W, 7-1/4 blade, adjustable cutting depth", rent: 120 },
  // ... (include all items from your list here for brevity)
];

function EquipmentItem({ item, checked, onChange }) {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{item.specs}</p>
        <div className="flex justify-between items-center">
          <Checkbox checked={checked} onChange={() => onChange(item)} />
          <span>Rent: ${item.rent}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleItem = (item) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(item)) {
      newSelectedItems.delete(item);
    } else {
      newSelectedItems.add(item);
    }
    setSelectedItems(newSelectedItems);
  };

  const totalRent = Array.from(selectedItems).reduce((sum, item) => sum + item.rent, 0);

  const clearAll = () => {
    setSelectedItems(new Set());
  };

  const handleDone = () => {
    alert(`Selected Items:\n${Array.from(selectedItems).map(i => i.name).join('\n')}\nTotal Rent: $${totalRent}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">David Rental Equipment</h1>
      <div className="flex justify-end mb-4">
        <div className="text-xl font-semibold">Total: ${totalRent}</div>
      </div>
      {equipmentList.map(item => (
        <EquipmentItem 
          key={item.name} 
          item={item} 
          checked={selectedItems.has(item)} 
          onChange={toggleItem} 
        />
      ))}
      <div className="mt-4 flex justify-between">
        <Button onClick={handleDone}>Done with Selection</Button>
        <Button onClick={clearAll}>Clear All</Button>
      </div>
    </div>
  );
}