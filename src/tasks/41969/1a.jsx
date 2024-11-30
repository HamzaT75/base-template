import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { format } from 'date-fns';

// Status options for the dropdown
const statusOptions = ['Not Started', 'In Progress', 'Completed'];

function AssignmentForm({ onSubmit }) {
  const [assignment, setAssignment] = useState({ name: '', course: '', deadline: '', hours: '', status: statusOptions[0] });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...assignment, id: Date.now() });
    setAssignment({ name: '', course: '', deadline: '', hours: '', status: statusOptions[0] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="assignmentName">Name</Label>
            <Input id="assignmentName" value={assignment.name} onChange={e => setAssignment({...assignment, name: e.target.value})} required />
            
            <Label htmlFor="courseName">Course</Label>
            <Input id="courseName" value={assignment.course} onChange={e => setAssignment({...assignment, course: e.target.value})} required />
            
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="date" value={assignment.deadline} onChange={e => setAssignment({...assignment, deadline: e.target.value})} required />
            
            <Label htmlFor="hours">Estimated Hours</Label>
            <Input id="hours" type="number" value={assignment.hours} onChange={e => setAssignment({...assignment, hours: e.target.value})} required />
            
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={assignment.status} onChange={status => setAssignment({...assignment, status})}>
              {statusOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </Select>
            
            <Button type="submit">Add Assignment</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AssignmentList({ assignments, onSelect }) {
  return (
    <div className="grid gap-4">
      {assignments.map(assignment => (
        <Card key={assignment.id} onClick={() => onSelect(assignment)} className="cursor-pointer">
          <CardHeader>
            <CardTitle>{assignment.name}</CardTitle>
            <CardDescription>{assignment.course}</CardDescription>
          </CardHeader>
          <CardFooter>
            <p>{assignment.status}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  return (
    <Input 
      type="text" 
      placeholder="Search by name or course..." 
      value={query} 
      onChange={e => {
        setQuery(e.target.value);
        onSearch(e.target.value);
      }} 
    />
  );
}

function GanttChart({ assignments }) {
  // Simplified Gantt chart representation
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left">Assignment</th>
            <th className="px-6 py-3 bg-gray-50">Timeline</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id}>
              <td className="px-6 py-4">{a.name}</td>
              <td className="px-6 py-4">
                <div className="relative h-4 bg-gray-200 rounded-full">
                  <div style={{ width: `${a.status === 'Completed' ? 100 : a.status === 'In Progress' ? 50 : 0}%` }} className="absolute h-full bg-blue-500 rounded-full"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssignments = useMemo(() => 
    assignments.filter(assignment => 
      assignment.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      assignment.course.toLowerCase().includes(searchQuery.toLowerCase())
    ), [assignments, searchQuery]);

  const addAssignment = (assignment) => {
    setAssignments([...assignments, assignment]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Assignment Tracker</h1>
      <AssignmentForm onSubmit={addAssignment} />
      <SearchBar onSearch={setSearchQuery} className="my-4" />
      {selectedAssignment ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedAssignment.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Course:</strong> {selectedAssignment.course}</p>
            <p><strong>Deadline:</strong> {format(new Date(selectedAssignment.deadline), 'PP')}</p>
            <p><strong>Estimated Hours:</strong> {selectedAssignment.hours}</p>
            <p><strong>Status:</strong> {selectedAssignment.status}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setSelectedAssignment(null)}>Back to List</Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <AssignmentList assignments={filteredAssignments} onSelect={setSelectedAssignment} />
          <GanttChart assignments={filteredAssignments} className="mt-4" />
        </>
      )}
    </div>
  );
}