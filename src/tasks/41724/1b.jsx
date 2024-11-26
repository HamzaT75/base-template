import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const tools = [
  "Hammer",
  "Screwdriver",
  "Drill",
  "Saw",
  "Pliers",
  "Wrench",
  "Measuring Tape",
  "Level",
  "Paint Brush",
  "Sander",
];

const projects = [
  {
    name: "Wooden Shelf",
    tools: ["Hammer", "Saw", "Measuring Tape", "Level"],
    difficulty: "Easy",
    description: "Create a simple wooden shelf for your home.",
  },
  {
    name: "Picture Frame",
    tools: ["Hammer", "Saw", "Measuring Tape"],
    difficulty: "Easy",
    description: "Build a custom picture frame for your favorite photo.",
  },
  {
    name: "Birdhouse",
    tools: ["Hammer", "Saw", "Drill", "Measuring Tape"],
    difficulty: "Medium",
    description: "Construct a cozy birdhouse for your garden.",
  },
  {
    name: "Bookcase",
    tools: ["Hammer", "Saw", "Drill", "Measuring Tape", "Level"],
    difficulty: "Medium",
    description: "Build a sturdy bookcase to organize your library.",
  },
  {
    name: "Coffee Table",
    tools: ["Hammer", "Saw", "Drill", "Measuring Tape", "Level", "Sander"],
    difficulty: "Hard",
    description: "Craft a beautiful coffee table for your living room.",
  },
];

const ToolSelector = ({ selectedTools, onToolToggle }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Select Your Tools</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {tools.map((tool) => (
          <div key={tool} className="flex items-center space-x-2">
            <Checkbox
              id={tool}
              checked={selectedTools.includes(tool)}
              onCheckedChange={() => onToolToggle(tool)}
            />
            <label htmlFor={tool} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {tool}
            </label>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ProjectCard = ({ project }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{project.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm mb-2">{project.description}</p>
      <p className="text-sm font-semibold">Difficulty: {project.difficulty}</p>
      <p className="text-sm mt-2">Tools needed:</p>
      <ul className="list-disc list-inside text-sm">
        {project.tools.map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const ProjectList = ({ projects }) => (
  <ScrollArea className="h-[400px] sm:h-[600px]">
    {projects.map((project) => (
      <ProjectCard key={project.name} project={project} />
    ))}
  </ScrollArea>
);

export default function App() {
  const [selectedTools, setSelectedTools] = useState([]);

  const handleToolToggle = (tool) => {
    setSelectedTools((prevTools) =>
      prevTools.includes(tool)
        ? prevTools.filter((t) => t !== tool)
        : [...prevTools, tool]
    );
  };

  const recommendedProjects = useMemo(() => {
    if (selectedTools.length === 0) return [];
    return projects.filter((project) =>
      project.tools.every((tool) => selectedTools.includes(tool))
    );
  }, [selectedTools]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DIY Project Recommender</h1>
      <ToolSelector
        selectedTools={selectedTools}
        onToolToggle={handleToolToggle}
      />
      <Card>
        <CardHeader>
          <CardTitle>Recommended Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedProjects.length > 0 ? (
            <ProjectList projects={recommendedProjects} />
          ) : (
            <p className="text-center text-gray-500">
              {selectedTools.length === 0
                ? "Select tools to see recommended projects"
                : "No projects found for the selected tools"}
            </p>
          )}
        </CardContent>
      </Card>
      <Button
        className="mt-4"
        onClick={() => setSelectedTools([])}
        disabled={selectedTools.length === 0}
      >
        Clear Selection
      </Button>
    </div>
  );
}