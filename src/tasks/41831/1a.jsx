import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Equipment data
const equipmentData = [
  { name: "Drill", specs: "18V cordless, 2-speed settings, keyless chuck", rent: 140 },
  { name: "Circular Saw", specs: "1200W, 7-1/4\" blade, adjustable cutting depth", rent: 120 },
  { name: "Impact Driver", specs: "20V battery, 1,500 in-lbs torque", rent: 150 },
  { name: "Angle Grinder", specs: "4.5\", 11,000 RPM, corded", rent: 110 },
  { name: "Concrete Mixer", specs: "5 cubic feet drum, electric-powered", rent: 200 },
  { name: "Jackhammer", specs: "2200W, 55 ft-lb impact force", rent: 100 },
  { name: "Scaffolding", specs: "Adjustable height, load capacity 500 lbs", rent: 170 },
  { name: "Projector", specs: "Full HD, 3000 lumens, HDMI/VGA input", rent: 1000 },
  { name: "Sound System", specs: "500W speakers, Bluetooth compatibility, mic included", rent: 1000 },
  { name: "Lighting", specs: "LED stage lights, adjustable brightness, RGB color options", rent: 1000 },
  { name: "Tent", specs: "4-person, waterproof, easy setup", rent: 600 },
  { name: "Sleeping Bag", specs: "20°F rating, lightweight, compact", rent: 100 },
  { name: "Camping Stove", specs: "2 burners, propane-powered, portable", rent: 100 },
  { name: "Popcorn Machine", specs: "8 oz capacity, tabletop model", rent: 200 },
  { name: "Chocolate Fountain", specs: "4-tier, stainless steel, easy to clean", rent: 100 },
  { name: "Inflatable Bounce House", specs: "13x13 ft, blower included", rent: 100 },
  { name: "Lawn Mower", specs: "21-inch blade, gas-powered, self-propelled", rent: 100 },
  { name: "Hedge Trimmer", specs: "18V cordless, dual-action blades", rent: 130 },
  { name: "Tiller", specs: "4-tine, 12-inch tilling width, electric-powered", rent: 100 },
  { name: "Pressure Washer", specs: "2,000 PSI, electric-powered", rent: 400 },
  { name: "Carpet Cleaner", specs: "1-gallon tank, dual rotating brushes", rent: 300 },
  { name: "Vacuum Cleaner", specs: "Wet/dry, 5-gallon capacity, 1200W motor", rent: 200 },
  { name: "Tripod", specs: "Adjustable height, 3-way pan head, lightweight", rent: 200 },
  { name: "Gimbal", specs: "3-axis stabilization, 12-hour battery life", rent: 400 },
  { name: "Lighting Kit", specs: "Softbox, adjustable color temperature, stands included", rent: 100 },
];

// EquipmentItem component
const EquipmentItem = ({ item, onChange, checked }) => (
  <div className="flex items-center space-x-2 p-2">
    <Checkbox id={item.name} checked={checked} onCheckedChange={(checked) => onChange(item, checked)} />
    <label htmlFor={item.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      <div>{item.name}</div>
      <div className="text-xs text-gray-500">{item.specs}</div>
      <div className="text-xs font-bold">Rent: ${item.rent}</div>
    </label>
  </div>
);

// Main App component
export default function App() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  // Calculate total rent
  const totalRent = selectedItems.reduce((sum, item) => sum + item.rent, 0);

  // Handle item selection
  const handleItemChange = (item, checked) => {
    setSelectedItems(prevItems =>
      checked
        ? [...prevItems, item]
        : prevItems.filter(i => i.name !== item.name)
    );
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedItems([]);
    setShowSummary(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">David Rental Equipment</h1>
      <div className="text-right mb-4">
        <span className="font-bold">Total Rent: ${totalRent}</span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Equipment List</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            {equipmentData.map(item => (
              <EquipmentItem
                key={item.name}
                item={item}
                onChange={handleItemChange}
                checked={selectedItems.some(i => i.name === item.name)}
              />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="mt-4 space-x-2">
        <Button onClick={() => setShowSummary(true)}>Done with Selection</Button>
        <Button variant="outline" onClick={clearAll}>Clear All</Button>
      </div>
      {showSummary && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Selected Items Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {selectedItems.map(item => (
                <li key={item.name} className="mb-2">
                  <span className="font-bold">{item.name}</span> - ${item.rent}
                </li>
              ))}
            </ul>
            <div className="mt-4 font-bold">Total Rent: ${totalRent}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}