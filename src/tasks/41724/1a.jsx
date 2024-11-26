import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const tools = [
  "Screw driver", "Hammer", "Saw", "Level", "Measuring Tape", "Scissors", "Paper"
];

const projects = [
  { name: "Chair", difficulty: "Medium", tools: ["Screw driver", "Hammer", "Saw"] },
  { name: "Table", difficulty: "Hard", tools: ["Screw driver", "Saw", "Level", "Measuring Tape"] },
  { name: "Picture Frame", difficulty: "Easy", tools: ["Saw", "Hammer", "Scissors", "Paper"] },
  { name: "Radio", difficulty: "Hard", tools: ["Screw driver", "Scissors"] },
  { name: "Window", difficulty: "Medium", tools: ["Screw driver", "Level", "Measuring Tape", "Saw"] },
];

function ToolCheckbox({ tool, checked, onChange }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={tool} checked={checked} onChange={onChange} />
      <Label htmlFor={tool}>{tool}</Label>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Difficulty: {project.difficulty}</p>
        <p>Tools Required: {project.tools.join(', ')}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [selectedTools, setSelectedTools] = useState(new Set());

  const toggleTool = (tool) => {
    const newSelectedTools = new Set(selectedTools);
    if (newSelectedTools.has(tool)) {
      newSelectedTools.delete(tool);
    } else {
      newSelectedTools.add(tool);
    }
    setSelectedTools(newSelectedTools);
  };

  const matchingProjects = projects.filter(project => 
    project.tools.every(tool => selectedTools.has(tool))
  );

  const resetTools = () => {
    setSelectedTools(new Set());
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Your Tools</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {tools.map(tool => (
            <ToolCheckbox 
              key={tool} 
              tool={tool} 
              checked={selectedTools.has(tool)} 
              onChange={() => toggleTool(tool)} 
            />
          ))}
        </CardContent>
        <Button onClick={resetTools} className="mt-4">Reset Tools</Button>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">Projects You Can Make:</h2>
        {matchingProjects.length > 0 ? (
          matchingProjects.map((project, idx) => (
            <ProjectCard key={idx} project={project} />
          ))
        ) : (
          <p>No projects match your selected tools.</p>
        )}
      </div>
    </div>
  );
}