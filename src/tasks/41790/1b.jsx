import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const subjects = {
  Mathematics: ['Algebra', 'Calculus', 'Geometry'],
  Physics: ['Mechanics', 'Thermodynamics', 'Electromagnetism'],
  Chemistry: ['Organic', 'Inorganic', 'Physical'],
  Biology: ['Botany', 'Zoology', 'Genetics'],
  English: ['Literature', 'Grammar', 'Composition'],
  History: ['Ancient', 'Medieval', 'Modern'],
  Geography: ['Physical', 'Human', 'Economic']
};

function TopicCheckbox({ topic, onToggle, checked }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={topic} checked={checked} onChange={() => onToggle(topic)} />
      <label htmlFor={topic}>{topic}</label>
    </div>
  );
}

function SubjectSuggestion() {
  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const resetTopics = () => {
    setSelectedTopics([]);
  };

  const suggestedSubjects = Object.entries(subjects).filter(([_, topics]) => 
    selectedTopics.some(topic => topics.includes(topic))
  ).map(([subject]) => subject);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Your Topics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(subjects).flatMap(subject => 
            subjects[subject].map(topic => (
              <TopicCheckbox 
                key={topic} 
                topic={topic} 
                onToggle={handleTopicToggle} 
                checked={selectedTopics.includes(topic)}
              />
            ))
          )}
        </CardContent>
        <div className="p-4 flex justify-end">
          <Button onClick={resetTopics}>Reset</Button>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Suggested Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestedSubjects.length > 0 ? (
            <ul className="list-disc pl-5">
              {suggestedSubjects.map(subject => (
                <li key={subject}>{subject}</li>
              ))}
            </ul>
          ) : (
            <p>No subjects suggested yet. Please select topics.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-8">
        <h1 className="text-center text-2xl font-bold mb-4">Subject Suggestion App</h1>
        <SubjectSuggestion />
      </div>
    </div>
  );
}