import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Garden size options
const gardenSizes = ["Small", "Medium", "Large"];

// Plant categories
const plantCategories = ["Flowers", "Vegetables", "Trees", "Shrubs", "Herbs", "Climbers"];

// Plant data
const plantData = {
  Small: {
    Herbs: [
      { name: "Basil", height: "1-2 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Parsley", height: "1 ft", sunlight: "Partial shade", water: "Moderate" },
      { name: "Cilantro", height: "1-2 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Thyme", height: "6-12 in", sunlight: "Full sun", water: "Low" },
      { name: "Dill", height: "2-3 ft", sunlight: "Full sun", water: "Moderate" },
    ],
    Vegetables: [
      { name: "Cherry Tomatoes", height: "3-4 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Baby Carrots", height: "6-8 in", sunlight: "Full sun", water: "Moderate" },
      { name: "Radishes", height: "6-8 in", sunlight: "Full sun", water: "Moderate" },
      { name: "Lettuce", height: "6-12 in", sunlight: "Partial shade", water: "Moderate" },
      { name: "Spinach", height: "6-12 in", sunlight: "Partial shade", water: "Moderate" },
    ],
    Flowers: [
      { name: "Marigolds", height: "6-12 in", sunlight: "Full sun", water: "Low" },
      { name: "Pansies", height: "4-8 in", sunlight: "Partial shade", water: "Moderate" },
      { name: "Petunias", height: "6-12 in", sunlight: "Full sun", water: "Moderate" },
      { name: "Alyssum", height: "3-6 in", sunlight: "Full sun", water: "Moderate" },
      { name: "Nasturtiums", height: "1-2 ft", sunlight: "Full sun", water: "Low" },
    ],
  },
  Medium: {
    Shrubs: [
      { name: "Lavender", height: "2-3 ft", sunlight: "Full sun", water: "Low" },
      { name: "Rosemary", height: "3-5 ft", sunlight: "Full sun", water: "Low" },
      { name: "Salvia", height: "2-3 ft", sunlight: "Full sun", water: "Low" },
      { name: "Hydrangea", height: "3-6 ft", sunlight: "Partial shade", water: "High" },
    ],
    Vegetables: [
      { name: "Bell Peppers", height: "2-3 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Eggplant", height: "2-4 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Zucchini", height: "2-3 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Bush Beans", height: "1-2 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Broccoli", height: "1-2 ft", sunlight: "Full sun", water: "Moderate" },
    ],
    Flowers: [
      { name: "Zinnias", height: "1-3 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Snapdragons", height: "1-3 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Cosmos", height: "2-4 ft", sunlight: "Full sun", water: "Low" },
      { name: "Dahlias", height: "1-6 ft", sunlight: "Full sun", water: "Moderate" },
    ],
  },
  Large: {
    Trees: [
      { name: "Maple", height: "40-100 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Oak", height: "50-100 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Pine", height: "50-150 ft", sunlight: "Full sun", water: "Low" },
      { name: "Lemon", height: "10-20 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Mango", height: "30-100 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Orange", height: "20-30 ft", sunlight: "Full sun", water: "Moderate" },
    ],
    Climbers: [
      { name: "Morning Glory", height: "6-10 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Clematis", height: "8-12 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Passionflower", height: "15-30 ft", sunlight: "Full sun", water: "Moderate" },
      { name: "Ivy", height: "20-80 ft", sunlight: "Partial shade", water: "Moderate" },
    ],
    Vegetables: [
      { name: "Pumpkins", height: "1-2 ft", sunlight: "Full sun", water: "High" },
      { name: "Watermelon", height: "1-2 ft", sunlight: "Full sun", water: "High" },
      { name: "Corn", height: "6-8 ft", sunlight: "Full sun", water: "High" },
      { name: "Butternut Squash", height: "1-2 ft", sunlight: "Full sun", water: "Moderate" },
    ],
  },
};

// PlantCard component to display individual plant suggestions
const PlantCard = ({ plant }) => (
  <Card className="w-full sm:w-64 m-2">
    <CardHeader>
      <CardTitle>{plant.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Height: {plant.height}</p>
      <p>Sunlight: {plant.sunlight}</p>
      <p>Water: {plant.water}</p>
    </CardContent>
  </Card>
);

// Main App component
export default function App() {
  const [gardenSize, setGardenSize] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Filter plant suggestions based on garden size and selected categories
  const suggestions = useMemo(() => {
    if (!gardenSize || selectedCategories.length === 0) return [];
    return selectedCategories.flatMap((category) =>
      (plantData[gardenSize][category] || []).map((plant) => ({ ...plant, category }))
    );
  }, [gardenSize, selectedCategories]);

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Home Gardner Suggester</h1>
      
      {/* Garden size selection */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Garden Size:</h2>
        <Select onValueChange={setGardenSize}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Garden Size" />
          </SelectTrigger>
          <SelectContent>
            {gardenSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Plant category selection */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Plant Categories:</h2>
        <div className="flex flex-wrap gap-2">
          {plantCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Plant suggestions */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Suggestions:</h2>
        <div className="flex flex-wrap justify-center sm:justify-start">
          {suggestions.map((plant, index) => (
            <PlantCard key={`${plant.name}-${index}`} plant={plant} />
          ))}
        </div>
      </div>
    </div>
  );
}