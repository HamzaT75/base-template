import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ToastProvider, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { X } from "lucide-react";

const generateRandomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

const ColorBox = ({ color }) => (
  <div 
    className="w-64 h-64 mx-auto mb-4 rounded-lg shadow-lg"
    style={{ backgroundColor: color }}
  />
);

const ColorCode = ({ color }) => (
  <p className="text-2xl font-bold text-center mb-4">{color}</p>
);

const Controls = ({ onGenerate, onCopy, onSave }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-4">
    <Button 
      onClick={onGenerate}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Generate New Color
    </Button>
    <Button 
      onClick={onCopy}
      variant="outline"
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
    >
      Copy Code
    </Button>
    <Button 
      onClick={onSave}
      variant="outline"
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
    >
      Save to Favorites
    </Button>
  </div>
);

const FavoriteColor = ({ color, onRemove }) => (
  <div className="flex items-center justify-between p-2 bg-gray-100 rounded mb-2">
    <div className="flex items-center">
      <div 
        className="w-6 h-6 rounded-full mr-2"
        style={{ backgroundColor: color }}
      />
      <span>{color}</span>
    </div>
    <Button 
      onClick={() => onRemove(color)}
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-700"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

const Favorites = ({ favorites, onRemove }) => (
  <Collapsible className="w-full mt-4">
    <CollapsibleTrigger asChild>
      <Button variant="outline" className="w-full mb-2">
        Favorites ({favorites.length})
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent className="space-y-2">
      {favorites.map((color) => (
        <FavoriteColor key={color} color={color} onRemove={onRemove} />
      ))}
    </CollapsibleContent>
  </Collapsible>
);

export default function App() {
  const [color, setColor] = useState(generateRandomColor());
  const [favorites, setFavorites] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('colorFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('colorFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleGenerate = () => {
    setColor(generateRandomColor());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setShowToast(true);
  };

  const handleSave = () => {
    if (!favorites.includes(color)) {
      setFavorites([...favorites, color]);
    }
  };

  const handleRemove = (colorToRemove) => {
    setFavorites(favorites.filter((c) => c !== colorToRemove));
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Random Color Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ColorBox color={color} />
            <ColorCode color={color} />
            <Controls
              onGenerate={handleGenerate}
              onCopy={handleCopy}
              onSave={handleSave}
            />
            <Favorites favorites={favorites} onRemove={handleRemove} />
          </CardContent>
        </Card>
      </div>
      {showToast && (
        <Toast>
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>Color code copied to clipboard!</ToastDescription>
        </Toast>
      )}
    </ToastProvider>
  );
}