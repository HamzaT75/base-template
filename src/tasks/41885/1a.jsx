import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const ingredientsList = [
  'salt', 'onions', 'potatoes', 'tomatoes', 'green pepper', 'red pepper', 'white pepper', 'black pepper', 'paprika', 'garlic', 
  'chili powder', 'thyme', 'oregano', 'pepper', 'rosemary', 'cinnamon', 'chicken', 'chicken breasts', 'chicken strips', 'beef',
  'fish fillets', 'shrimp', 'whole fish', 'eggs', 'lentils', 'oil', 'butter', 'cheese', 'yogurt', 'milk', 'carrots', 'sugar',
  'baking powder', 'baking soda', 'cocoa powder', 'yeast', 'flour', 'cornstarch', 'breadcrumbs', 'vanilla extract', 'broccoli',
  'beans', 'spinach', 'bamboo shoots', 'zucchini', 'bell peppers', 'mushrooms', 'asparagus', 'bananas', 'berries', 'mango', 
  'avocado', 'olive oil', 'chicken stock', 'vegetable stock', 'beef stock', 'water', 'batter mix', 'dumpling dough', 'honey',
  'almonds', 'peanuts', 'walnuts', 'cashew nuts'
];

const dishes = {
  'Cakes': ['flour', 'sugar', 'eggs', 'butter', 'baking powder', 'milk', 'vanilla extract'],
  // Add more dishes here similarly...
};

function IngredientCheckbox({ ingredient, onCheck }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={ingredient} onCheckedChange={(checked) => onCheck(ingredient, checked)} />
      <label htmlFor={ingredient}>{ingredient}</label>
    </div>
  );
}

function DishCard({ dish, ingredients }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{dish}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{ingredients.join(', ')}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [selectedIngredients, setSelectedIngredients] = useState(new Set());

  const toggleIngredient = (ingredient, checked) => {
    setSelectedIngredients(prev => {
      let newSet = new Set(prev);
      if (checked) {
        newSet.add(ingredient);
      } else {
        newSet.delete(ingredient);
      }
      return newSet;
    });
  };

  const selectAll = () => setSelectedIngredients(new Set(ingredientsList));
  const deselectAll = () => setSelectedIngredients(new Set());

  const availableDishes = Object.keys(dishes).filter(dish => 
    dishes[dish].every(ing => selectedIngredients.has(ing))
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4">What can I make?</h1>
      <p className="mb-4">Choose the ingredients you have to see the available dish options.</p>
      
      <div className="mb-4">
        <Button onClick={selectAll}>Select All</Button>
        <Button onClick={deselectAll} className="ml-2">Deselect All</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ingredientsList.map(ingredient => (
          <IngredientCheckbox 
            key={ingredient} 
            ingredient={ingredient} 
            onCheck={toggleIngredient} 
          />
        ))}
      </div>

      <h2 className="text-2xl mt-8 mb-4">You can make:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableDishes.map(dish => (
          <DishCard key={dish} dish={dish} ingredients={dishes[dish]} />
        ))}
      </div>
    </div>
  );
}