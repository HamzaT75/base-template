import React, { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tools = [
  "Screwdriver",
  "Hammer",
  "Saw",
  "Level",
  "Measuring Tape",
  "Scissors",
  "Paper",
  "Glue",
  "Paint",
  "Drill",
];

const projects = [
  {
    name: "Picture Frame",
    difficulty: "Easy",
    tools: ["Measuring Tape", "Saw", "Hammer", "Glue"],
  },
  {
    name: "Bookshelf",
    difficulty: "Medium",
    tools: ["Measuring Tape", "Saw", "Screwdriver", "Level", "Drill"],
  },
  {
    name: "Bird House",
    difficulty: "Easy",
    tools: ["Saw", "Hammer", "Measuring Tape", "Paint"],
  },
  {
    name: "DIY Lamp",
    difficulty: "Medium",
    tools: ["Screwdriver", "Drill", "Scissors", "Glue"],
  },
  {
    name: "Garden Planter",
    difficulty: "Easy",
    tools: ["Saw", "Hammer", "Measuring Tape", "Paint", "Drill"],
  },
  {
    name: "Wall Art",
    difficulty: "Easy",
    tools: ["Scissors", "Paper", "Glue", "Paint"],
  },
  {
    name: "Floating Shelves",
    difficulty: "Medium",
    tools: ["Measuring Tape", "Level", "Drill", "Screwdriver"],
  },
  {
    name: "Desk Organizer",
    difficulty: "Easy",
    tools: ["Measuring Tape", "Saw", "Glue", "Paint"],
  },
  {
    name: "Wooden Stool",
    difficulty: "Hard",
    tools: ["Saw", "Drill", "Screwdriver", "Measuring Tape", "Level"],
  },
  {
    name: "Wind Chimes",
    difficulty: "Medium",
    tools: ["Drill", "Scissors", "Measuring Tape", "Paint"],
  },
];

const ToolCheckbox = ({ tool, isChecked, onChange }) => (
  <div className="flex items-center space-x-2 mb-2">
    <Checkbox id={tool} checked={isChecked} onCheckedChange={onChange} />
    <label htmlFor={tool} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {tool}
    </label>
  </div>
);

const ProjectCard = ({ project }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg">{project.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <Badge className={`mb-2 ${project.difficulty === 'Easy' ? 'bg-green-500' : project.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
        {project.difficulty}
      </Badge>
      <p className="text-sm">Tools required:</p>
      <ul className="list-disc list-inside text-sm">
        {project.tools.map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default function App() {
  const [selectedTools, setSelectedTools] = useState(new Set());

  const handleToolChange = (tool) => {
    setSelectedTools((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tool)) {
        newSet.delete(tool);
      } else {
        newSet.add(tool);
      }
      return newSet;
    });
  };

  const resetTools = () => {
    setSelectedTools(new Set());
  };

  const availableProjects = useMemo(() => {
    if (selectedTools.size === 0) return [];
    return projects.filter((project) =>
      project.tools.every((tool) => selectedTools.has(tool))
    );
  }, [selectedTools]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">DIY Mini Project Suggester</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Available Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-1">
            {tools.map((tool) => (
              <ToolCheckbox
                key={tool}
                tool={tool}
                isChecked={selectedTools.has(tool)}
                onChange={() => handleToolChange(tool)}
              />
            ))}
          </div>
          <Button onClick={resetTools} className="mt-4">
            Reset Tools
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Suggested Projects</h2>
          {availableProjects.length > 0 ? (
            availableProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))
          ) : (
            <p>Select tools to see available projects.</p>
          )}
        </div>
      </div>
    </div>
  );
}