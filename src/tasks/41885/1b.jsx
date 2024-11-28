import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const ingredients = [
  "salt", "onions", "potatoes", "tomatoes", "green pepper", "red pepper", "white pepper",
  "black pepper", "paprika", "garlic", "chili powder", "thyme", "oregano", "pepper",
  "rosemary", "cinnamon", "chicken", "chicken breasts", "chicken strips", "beef",
  "fish fillets", "shrimp", "whole fish", "eggs", "lentils", "oil", "butter", "cheese",
  "yogurt", "milk", "carrots", "sugar", "baking powder", "baking soda", "cocoa powder",
  "yeast", "flour", "cornstarch", "breadcrumbs", "vanilla extract", "broccoli", "beans",
  "spinach", "bamboo shoots", "zucchini", "bell peppers", "mushrooms", "asparagus",
  "bananas", "berries", "mango", "avocado", "olive oil", "chicken stock", "vegetable stock",
  "beef stock", "water", "batter mix", "dumpling dough", "honey", "almonds", "peanuts",
  "walnuts", "cashew nuts"
];

const dishes = {
  "Cakes": ["flour", "sugar", "eggs", "butter", "baking powder", "milk", "vanilla extract"],
  "Cookies": ["flour", "sugar", "butter", "eggs", "baking soda", "chocolate chips", "vanilla extract"],
  "Bread": ["flour", "yeast", "water", "salt", "sugar", "butter", "milk"],
  "Muffins": ["flour", "sugar", "eggs", "butter", "baking powder", "milk"],
  "Pies": ["flour", "butter", "sugar", "salt", "water"],
  "Tarts": ["flour", "butter", "sugar", "eggs", "cream"],
  "Brownies": ["cocoa powder", "sugar", "butter", "eggs", "flour", "chocolate", "vanilla extract"],
  "Fried chicken": ["chicken", "flour", "eggs", "breadcrumbs", "oil"],
  "French fries": ["potatoes", "salt", "oil"],
  "Onion rings": ["onions", "flour", "breadcrumbs", "eggs", "oil"],
  "Tempura": ["shrimp", "batter mix", "oil"],
  "Doughnuts": ["flour", "sugar", "eggs", "butter", "yeast", "milk", "oil"],
  "Samosas": ["flour", "potatoes", "peas", "oil"],
  "Pakoras": ["chickpea flour", "vegetables", "oil"],
  "Pasta": ["pasta", "salt", "water"],
  "Boiled rice": ["rice", "water", "salt"],
  "Soups": ["stock", "vegetables", "meat"],
  "Mashed potatoes": ["potatoes", "butter", "milk", "salt", "pepper"],
  "Hard-boiled eggs": ["eggs", "water", "salt"],
  "Stews": ["meat", "vegetables", "stock"],
  "Steamed fish": ["fish", "water", "lemon"],
  "Dumplings": ["flour", "water", "dumpling dough", "salt"],
  "Idlis": ["rice", "lentils", "water", "salt"],
  "Steamed vegetables": ["vegetables", "water", "salt"],
  "Rice": ["rice", "water", "salt"],
  "Bao buns": ["flour", "yeast", "sugar", "water", "salt"],
  "Grilled steak": ["beef", "salt", "pepper", "oil"],
  "Chicken skewers": ["chicken", "oil"],
  "Vegetable kebabs": ["vegetables", "oil", "salt", "pepper"],
  "Grilled salmon": ["fish fillets", "salt", "pepper", "lemon"],
  "Burgers": ["beef", "cheese"],
  "Stir-fried vegetables": ["vegetables", "oil", "garlic"],
  "Chicken stir-fry": ["chicken", "vegetables", "garlic", "oil"],
  "Garlic shrimp": ["shrimp", "garlic", "oil", "butter"],
  "Sautéed spinach": ["spinach", "garlic", "oil", "salt"],
  "Roasted chicken": ["chicken", "oil", "salt", "pepper"],
  "Roasted vegetables": ["vegetables", "oil", "salt", "pepper"],
  "Roast beef": ["beef", "oil", "salt", "pepper"],
  "Baked salmon": ["fish fillets", "oil", "salt", "pepper", "lemon"],
  "Broiled steak": ["beef", "salt", "pepper", "oil"],
  "Broiled fish": ["fish fillets", "oil", "salt", "pepper", "lemon"],
  "Broiled asparagus": ["asparagus", "oil", "salt", "pepper", "garlic"],
  "Cheesy gratins": ["potatoes", "cheese", "butter", "salt", "pepper"],
  "Beef stew": ["beef", "vegetables", "stock"],
  "Chili": ["beef", "beans", "tomatoes"],
  "Lentil soup": ["lentils", "vegetables", "stock"],
  "Pot roast": ["beef", "vegetables", "stock"],
  "Smoothies": ["fruits", "milk", "yogurt"],
  "Hummus": ["chickpeas", "olive oil", "lemon", "garlic"],
  "Pesto": ["olive oil", "garlic"],
  "Tomato sauce": ["tomatoes", "garlic", "onions", "olive oil"],
  "Salsa": ["tomatoes", "onions", "chili powder", "lime", "salt"]
};

function IngredientList({ selectedIngredients, toggleIngredient }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {ingredients.map((ingredient) => (
        <div key={ingredient} className="flex items-center space-x-2">
          <Checkbox
            id={ingredient}
            checked={selectedIngredients.includes(ingredient)}
            onCheckedChange={() => toggleIngredient(ingredient)}
          />
          <label
            htmlFor={ingredient}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {ingredient}
          </label>
        </div>
      ))}
    </div>
  );
}

function DishList({ availableDishes }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {availableDishes.map((dish) => (
        <Card key={dish.name}>
          <CardHeader>
            <CardTitle>{dish.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{dish.ingredients.join(", ")}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const selectAll = () => setSelectedIngredients(ingredients);
  const deselectAll = () => setSelectedIngredients([]);

  const availableDishes = Object.entries(dishes)
    .filter(([_, ingredients]) =>
      ingredients.every((ingredient) => selectedIngredients.includes(ingredient))
    )
    .map(([name, ingredients]) => ({ name, ingredients }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">What can I make?</h1>
      <p className="mb-4">Choose the ingredients you have to see the available dish options.</p>
      
      <div className="mb-4 space-x-2">
        <Button onClick={selectAll}>Select All</Button>
        <Button onClick={deselectAll} variant="outline">
          Deselect All
        </Button>
      </div>
      
      <IngredientList
        selectedIngredients={selectedIngredients}
        toggleIngredient={toggleIngredient}
      />
      
      <h2 className="text-2xl font-semibold my-4">Available Dishes</h2>
      <DishList availableDishes={availableDishes} />
    </div>
  );
}