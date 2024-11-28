import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const professions = [
  { id: 1, name: 'Mason', tools: 'Trowel, chisel, hammer, level, mortar mixer, masonry saw, tape measure' },
  { id: 2, name: 'Painter', tools: 'Paintbrushes, rollers, paint trays, drop cloths, masking tape, ladder, sandpaper, scraper' },
  // Add other professions similarly...
  { id: 15, name: 'Glass Installer/Glazier', tools: 'Glass cutter, putty knife, suction cups, glazing tools, hammer, pliers, tape measure' },
];

function ProfessionCheckbox({ profession, onToggle }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={`profession-${profession.id}`} onCheckedChange={() => onToggle(profession.id)} />
      <label htmlFor={`profession-${profession.id}`} className="text-sm font-medium text-gray-700">
        {profession.name}
      </label>
    </div>
  );
}

function ToolsCard({ tools, profession }) {
  return (
    <Card className="mt-4 sm:mx-2 w-full sm:w-1/2 lg:w-1/3">
      <CardHeader>
        <CardTitle>{profession}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{tools}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [selectedProfessions, setSelectedProfessions] = useState([]);

  const toggleProfession = (id) => {
    setSelectedProfessions(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const deselectAll = () => {
    setSelectedProfessions([]);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">DIY Tools Recommender</h1>
      <div className="flex flex-wrap gap-4">
        {professions.map(profession => (
          <ProfessionCheckbox 
            key={profession.id} 
            profession={profession} 
            onToggle={toggleProfession} 
          />
        ))}
      </div>
      <Button onClick={deselectAll} className="mb-4">Deselect All</Button>
      <div className="flex flex-wrap -mx-2">
        {selectedProfessions.map(id => {
          const prof = professions.find(p => p.id === id);
          return <ToolsCard key={id} tools={prof.tools} profession={prof.name} />;
        })}
      </div>
    </div>
  );
}