import React, { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Data for garden plants
const gardenData = {
  small: {
    herbs: ['Basil', 'Parsley', 'Cilantro', 'Thyme', 'Dill'],
    vegetables: ['Cherry Tomatoes', 'Baby Carrots', 'Radishes', 'Lettuce', 'Spinach'],
    flowers: ['Marigolds', 'Pansies', 'Petunias', 'Alyssum', 'Nasturtiums']
  },
  medium: {
    shrubs: ['Lavender', 'Rosemary', 'Salvia', 'Hydrangea'],
    vegetables: ['Bell Peppers', 'Eggplant', 'Zucchini', 'Bush Beans', 'Broccoli'],
    flowers: ['Zinnias', 'Snapdragons', 'Cosmos', 'Dahlias']
  },
  large: {
    trees: ['Maple', 'Oak', 'Pine', 'Lemon', 'Mango', 'Orange'],
    climbers: ['Morning Glory', 'Clematis', 'Passionflower', 'Ivy'],
    vegetables: ['Pumpkins', 'Watermelon', 'Corn', 'Butternut Squash']
  }
};

// Plant details for demonstration
const plantDetails = {
  'Basil': { category: 'Herb', height: '1-2 ft', sunlight: 'Full Sun', water: 'Regular' },
  // Add more details here for other plants...
};

function PlantSuggestion({ plant, category, height, sunlight, water }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{plant}</CardTitle>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Height: {height}</p>
        <p>Sunlight: {sunlight}</p>
        <p>Water: {water}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [gardenSize, setGardenSize] = useState('small');
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleSizeChange = (value) => setGardenSize(value);
  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const suggestions = gardenData[gardenSize] ? 
    Object.keys(gardenData[gardenSize])
      .filter(type => selectedTypes.includes(type))
      .flatMap(type => gardenData[gardenSize][type].map(plant => ({
        name: plant,
        ...(plantDetails[plant] || { category: type, height: 'N/A', sunlight: 'N/A', water: 'N/A' })
      }))) : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home Gardener Suggester</h1>
      
      {/* Garden Size Selector */}
      <RadioGroup value={gardenSize} onValueChange={handleSizeChange} className="mb-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="small" id="small" />
          <Label htmlFor="small">Small</Label>
          <RadioGroupItem value="medium" id="medium" />
          <Label htmlFor="medium">Medium</Label>
          <RadioGroupItem value="large" id="large" />
          <Label htmlFor="large">Large</Label>
        </div>
      </RadioGroup>

      {/* Plant Type Selector */}
      <div className="mb-4">
        {Object.keys(gardenData[gardenSize] || {}).map(type => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox 
              id={type} 
              checked={selectedTypes.includes(type)} 
              onCheckedChange={() => handleTypeChange(type)} 
            />
            <Label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
          </div>
        ))}
      </div>

      {/* Plant Suggestions */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, index) => (
          <PlantSuggestion key={index} {...suggestion} />
        ))}
      </div>
    </div>
  );
}