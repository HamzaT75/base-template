import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const recipes = [
  {
    id: 1,
    name: "Chocolate Chip Cookies",
    avgRating: 4.5,
    ratingsCount: 120,
    ingredients: ["flour", "sugar", "chocolate chips", "eggs"],
    steps: ["Mix ingredients", "Bake at 350°F", "Cool down"],
    prepTime: "15 mins",
    cookTime: "10 mins",
    servings: 24,
    comments: []
  },
  // Add more recipes here
];

function StarRating({ count, onRatingChange }) {
  const stars = Array(5).fill(0).map((_, index) => (
    <button key={index} onClick={() => onRatingChange(index + 1)}>
      {index < count ? "★" : "☆"}
    </button>
  ));

  return <div className="flex">{stars}</div>;
}

function RecipeCard({ recipe, onSelect }) {
  const stars = Array(Math.round(recipe.avgRating)).fill("★").join('');
  const emptyStars = Array(5 - Math.round(recipe.avgRating)).fill("☆").join('');

  return (
    <Card className="mb-4 sm:mx-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500">{stars}</span>
          <span className="text-gray-400">{emptyStars}</span>
          <span className="ml-2 text-sm">{recipe.avgRating.toFixed(1)}</span>
        </div>
        <p>{recipe.ratingsCount} ratings</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSelect(recipe)}>View Details</Button>
        <Button variant="outline" className="ml-2">Rate & Comment</Button>
      </CardFooter>
    </Card>
  );
}

function RecipeDetails({ recipe, onClose, onRate }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <Card className="max-w-lg w-full p-4">
        <CardHeader>
          <CardTitle>{recipe.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <h4 className="font-bold">Ingredients:</h4>
          <ul className="list-disc ml-5">
            {recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
          <h4 className="font-bold mt-2">Steps:</h4>
          <ol className="list-decimal ml-5">
            {recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
          </ol>
          <p>Preparation Time: {recipe.prepTime}</p>
          <p>Cooking Time: {recipe.cookTime}</p>
          <p>Servings: {recipe.servings}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={onRate} className="ml-2">Rate Recipe</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function RateAndComment({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <div className="p-4">
      <StarRating count={rating} onRatingChange={setRating} />
      <Textarea 
        placeholder="Share your thoughts..." 
        value={comment} 
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={() => onSubmit(rating, comment)} className="mt-2">Submit</Button>
    </div>
  );
}

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRate, setShowRate] = useState(false);
  const [recipesState, setRecipesState] = useState(recipes);

  const handleRateSubmit = (id, rating, comment) => {
    setRecipesState(prev => 
      prev.map(r => r.id === id ? { 
        ...r, 
        avgRating: ((r.avgRating * r.ratingsCount + rating) / (r.ratingsCount + 1)).toFixed(1),
        ratingsCount: r.ratingsCount + 1,
        comments: [...r.comments, comment] 
      } : r)
    );
    setShowRate(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Ratings</h1>
      <div className="flex flex-wrap -mx-2">
        {recipesState.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onSelect={setSelectedRecipe} 
          />
        ))}
      </div>
      {selectedRecipe && (
        <RecipeDetails 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          onRate={() => setShowRate(true)} 
        />
      )}
      {showRate && selectedRecipe && (
        <RateAndComment 
          onSubmit={(rating, comment) => handleRateSubmit(selectedRecipe.id, rating, comment)} 
        />
      )}
    </div>
  );
}