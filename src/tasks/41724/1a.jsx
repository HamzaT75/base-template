import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const toolsList = [
  "Hammer", "Screwdriver", "Wrench", "Drill", "Saw", "Tape Measure", "Pliers", "Level"
];

const projects = {
  "Hammer": ["Build a birdhouse", "Hang a picture frame"],
  "Screwdriver": ["Assemble furniture", "Tighten loose screws around the house"],
  "Wrench": ["Fix a leaky faucet", "Assemble a bicycle"],
  "Drill": ["Install shelves", "Make holes for wiring"],
  "Saw": ["Cut wood for a DIY shelf", "Create custom wooden signs"],
  "Tape Measure": ["Measure for custom furniture", "Plan room layouts"],
  "Pliers": ["Jewelry making", "Wire bending for electronics"],
  "Level": ["Ensure picture frames are straight", "Install tiles"],
};

function ToolSelector({ tools, onSelect }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {tools.map(tool => (
        <div key={tool} className="flex items-center">
          <Checkbox 
            id={tool} 
            onChange={(e) => onSelect(tool, e.target.checked)}
          />
          <Label htmlFor={tool} className="ml-2">{tool}</Label>
        </div>
      ))}
    </div>
  );
}

function ProjectList({ projects }) {
  return (
    <div>
      {projects.map((project, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <CardTitle>{project}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              A fun project you can do with your selected tools!
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [selectedTools, setSelectedTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToolSelection = (tool, isSelected) => {
    setSelectedTools(prev => 
      isSelected ? [...prev, tool] : prev.filter(t => t !== tool)
    );
  };

  const filteredProjects = Object.entries(projects).filter(([tool]) => 
    selectedTools.includes(tool) && 
    (tool.toLowerCase().includes(searchTerm.toLowerCase()) || 
     projects[tool].some(project => project.toLowerCase().includes(searchTerm.toLowerCase())))
  ).flatMap(([_, value]) => value);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">DIY Project Recommender</h1>
      <div className="mb-4">
        <Input 
          placeholder="Search for tools or projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2"
        />
      </div>
      <ToolSelector tools={toolsList} onSelect={handleToolSelection} />
      <div className="mt-6">
        <h2 className="text-xl mb-4">Recommended Projects:</h2>
        {filteredProjects.length > 0 ? (
          <ProjectList projects={filteredProjects} />
        ) : (
          <p className="text-gray-500">No projects match your selected tools or search.</p>
        )}
      </div>
      <Button 
        onClick={() => setSelectedTools([])} 
        className="mt-4 w-full sm:w-auto"
      >
        Reset Selection
      </Button>
    </div>
  );
}