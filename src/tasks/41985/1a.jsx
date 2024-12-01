import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";

function generateRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function ColorBox({ color }) {
  return (
    <div className="w-full h-64 sm:h-96 bg-[color:var(--color)]" style={{ '--color': color }}></div>
  );
}

function ColorCodeDisplay({ color }) {
  const rgb = color.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16)).join(', ');

  return (
    <div className="text-center mt-4">
      <p className="text-xl font-bold">HEX: {color}</p>
      <p className="text-lg">RGB: rgb({rgb})</p>
    </div>
  );
}

function Controls({ onGenerate, onCopy, onSave }) {
  return (
    <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
      <Button onClick={onGenerate} className="w-full sm:w-auto">Generate New Color</Button>
      <Button variant="secondary" onClick={onCopy} className="w-full sm:w-auto">Copy Code</Button>
      <Button variant="secondary" onClick={onSave} className="w-full sm:w-auto">Save to Favorites</Button>
    </div>
  );
}

function FavoriteColor({ color, onRemove }) {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: color }}></div>
          {color}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <Button variant="destructive" size="icon" onClick={() => onRemove(color)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [currentColor, setCurrentColor] = useState(generateRandomColor());
  const [favorites, setFavorites] = useState([]);
  const [tooltip, setTooltip] = useState('');

  const handleGenerate = () => setCurrentColor(generateRandomColor());

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentColor).then(() => {
      setTooltip('Copied!');
      setTimeout(() => setTooltip(''), 2000);
    });
  }, [currentColor]);

  const handleSave = () => {
    if (!favorites.includes(currentColor)) {
      setFavorites([...favorites, currentColor]);
    }
  };

  const handleRemoveFavorite = (colorToRemove) => {
    setFavorites(favorites.filter(color => color !== colorToRemove));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <ColorBox color={currentColor} />
        <ColorCodeDisplay color={currentColor} />
        <Controls onGenerate={handleGenerate} onCopy={handleCopy} onSave={handleSave} />
        {tooltip && <Tooltip>{tooltip}</Tooltip>}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Favorites</h2>
        {favorites.length === 0 ? 
          <p>No favorite colors yet.</p> :
          favorites.map(color => 
            <FavoriteColor key={color} color={color} onRemove={handleRemoveFavorite} />
          )
        }
      </div>
    </div>
  );
}