import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

const initialRecipes = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    averageRating: 4.5,
    numRatings: 120,
    ingredients: ["400g spaghetti", "200g pancetta", "4 large eggs", "100g Parmesan cheese", "Black pepper"],
    steps: [
      "Cook spaghetti in salted water.",
      "Fry pancetta until crispy.",
      "Beat eggs with grated Parmesan.",
      "Mix pasta with pancetta, then add egg mixture.",
      "Season with black pepper and serve."
    ],
    prepTime: "10 minutes",
    cookTime: "15 minutes",
    servings: 4,
    comments: []
  },
  {
    id: 2,
    name: "Chicken Stir Fry",
    averageRating: 4.2,
    numRatings: 85,
    ingredients: ["500g chicken breast", "Mixed vegetables", "Soy sauce", "Ginger", "Garlic"],
    steps: [
      "Cut chicken into bite-sized pieces.",
      "Stir-fry chicken until golden.",
      "Add vegetables and stir-fry.",
      "Season with soy sauce, ginger, and garlic.",
      "Serve hot with rice."
    ],
    prepTime: "15 minutes",
    cookTime: "10 minutes",
    servings: 3,
    comments: []
  }
];

function StarRating({ rating }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

function RecipeCard({ recipe, onRateClick, onDetailsClick }) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription>
          <StarRating rating={Math.round(recipe.averageRating)} />
          <span className="ml-2">{recipe.averageRating.toFixed(1)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{recipe.numRatings} ratings</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onRateClick(recipe.id)}>Rate & Comment</Button>
        <Button onClick={() => onDetailsClick(recipe.id)}>Details</Button>
      </CardFooter>
    </Card>
  );
}

function RecipeDetails({ recipe, onClose }) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription>
          <p>Prep Time: {recipe.prepTime}</p>
          <p>Cook Time: {recipe.cookTime}</p>
          <p>Servings: {recipe.servings}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">Ingredients:</h3>
        <ul className="list-disc pl-5 mb-4">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h3 className="font-bold mb-2">Steps:</h3>
        <ol className="list-decimal pl-5 mb-4">
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <p>Ratings: {recipe.numRatings}</p>
        <p>Comments: {recipe.comments.length}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  );
}

function RateAndComment({ recipe, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(recipe.id, rating, comment);
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Rate and Comment: {recipe.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer ${
                star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <Textarea
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-4"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSubmit}>Submit</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isRating, setIsRating] = useState(false);

  const handleRateClick = (id) => {
    setSelectedRecipe(recipes.find(recipe => recipe.id === id));
    setIsRating(true);
  };

  const handleDetailsClick = (id) => {
    setSelectedRecipe(recipes.find(recipe => recipe.id === id));
    setIsRating(false);
  };

  const handleClose = () => {
    setSelectedRecipe(null);
    setIsRating(false);
  };

  const handleRateSubmit = (id, rating, comment) => {
    setRecipes(recipes.map(recipe => {
      if (recipe.id === id) {
        const newNumRatings = recipe.numRatings + 1;
        const newAverageRating = ((recipe.averageRating * recipe.numRatings) + rating) / newNumRatings;
        return {
          ...recipe,
          averageRating: newAverageRating,
          numRatings: newNumRatings,
          comments: [...recipe.comments, comment]
        };
      }
      return recipe;
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Ratings App</h1>
      {selectedRecipe ? (
        isRating ? (
          <RateAndComment recipe={selectedRecipe} onSubmit={handleRateSubmit} onClose={handleClose} />
        ) : (
          <RecipeDetails recipe={selectedRecipe} onClose={handleClose} />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onRateClick={handleRateClick}
              onDetailsClick={handleDetailsClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}