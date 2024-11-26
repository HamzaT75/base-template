import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const topics = [
  { id: 1, name: "Algebra", subject: "Mathematics" },
  { id: 2, name: "Geometry", subject: "Mathematics" },
  { id: 3, name: "Calculus", subject: "Mathematics" },
  { id: 4, name: "Mechanics", subject: "Physics" },
  { id: 5, name: "Thermodynamics", subject: "Physics" },
  { id: 6, name: "Optics", subject: "Physics" },
  { id: 7, name: "Organic Chemistry", subject: "Chemistry" },
  { id: 8, name: "Inorganic Chemistry", subject: "Chemistry" },
  { id: 9, name: "Genetics", subject: "Biology" },
  { id: 10, name: "Ecology", subject: "Biology" },
  { id: 11, name: "Grammar", subject: "English" },
  { id: 12, name: "Literature", subject: "English" },
  { id: 13, name: "World War II", subject: "History" },
  { id: 14, name: "Renaissance", subject: "History" },
  { id: 15, name: "Climate", subject: "Geography" },
  { id: 16, name: "Cartography", subject: "Geography" },
];

const TopicItem = ({ topic, isSelected, onToggle }) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <Checkbox
        id={`topic-${topic.id}`}
        checked={isSelected}
        onCheckedChange={() => onToggle(topic.id)}
      />
      <label
        htmlFor={`topic-${topic.id}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {topic.name}
      </label>
    </div>
  );
};

const SubjectCard = ({ subject, count }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{subject}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Selected topics: {count}</p>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [suggestedSubjects, setSuggestedSubjects] = useState({});

  useEffect(() => {
    const subjects = selectedTopics.reduce((acc, topicId) => {
      const topic = topics.find((t) => t.id === topicId);
      if (topic) {
        acc[topic.subject] = (acc[topic.subject] || 0) + 1;
      }
      return acc;
    }, {});
    setSuggestedSubjects(subjects);
  }, [selectedTopics]);

  const handleTopicToggle = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleReset = () => {
    setSelectedTopics([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subject Suggestion App</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Topics</CardTitle>
          </CardHeader>
          <CardContent>
            {topics.map((topic) => (
              <TopicItem
                key={topic.id}
                topic={topic}
                isSelected={selectedTopics.includes(topic.id)}
                onToggle={handleTopicToggle}
              />
            ))}
            <Button onClick={handleReset} className="mt-4">
              Reset
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Suggested Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(suggestedSubjects).map(([subject, count]) => (
              <SubjectCard key={subject} subject={subject} count={count} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}