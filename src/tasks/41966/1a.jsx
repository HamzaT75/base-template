import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function JournalForm({ onSubmit, onReset }) {
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [tasks, setTasks] = useState("");
  const [goals, setGoals] = useState("");
  const [highlights, setHighlights] = useState("");
  const [challenges, setChallenges] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ date, day, tasks, goals, highlights, challenges });
    handleReset();
  };

  const handleReset = () => {
    setDate("");
    setDay("");
    setTasks("");
    setGoals("");
    setHighlights("");
    setChallenges("");
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Select Date
          </label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="day" className="block text-sm font-medium text-gray-700">
            Select Day
          </label>
          <Select value={day} onValueChange={setDay} required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label htmlFor="tasks" className="block text-sm font-medium text-gray-700">
          Tasks/Activities for the Day
        </label>
        <Textarea
          id="tasks"
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
          What are your goals for today?
        </label>
        <Textarea
          id="goals"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <label htmlFor="highlights" className="block text-sm font-medium text-gray-700">
          What were the highlights of your day?
        </label>
        <Textarea
          id="highlights"
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <label htmlFor="challenges" className="block text-sm font-medium text-gray-700">
          What challenges did you face?
        </label>
        <Textarea
          id="challenges"
          value={challenges}
          onChange={(e) => setChallenges(e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={handleReset} variant="outline">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}

function JournalEntry({ entry }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{entry.date} - {entry.day}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Tasks/Activities:</strong> {entry.tasks}</p>
        <p><strong>Goals:</strong> {entry.goals}</p>
        <p><strong>Highlights:</strong> {entry.highlights}</p>
        <p><strong>Challenges:</strong> {entry.challenges}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);

  const handleSubmit = (newEntry) => {
    setEntries([newEntry, ...entries]);
  };

  const handleReset = () => {
    // This function is passed to the form but doesn't need to do anything here
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Journal App</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <JournalForm onSubmit={handleSubmit} onReset={handleReset} />
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mt-8 mb-4">Journal Entries</h2>
      {entries.map((entry, index) => (
        <JournalEntry key={index} entry={entry} />
      ))}
    </div>
  );
}