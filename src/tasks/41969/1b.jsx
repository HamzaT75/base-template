import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Status options for assignments
const statusOptions = ["Not Started", "In Progress", "Completed"];

// Component for the assignment form
const AssignmentForm = ({ onSubmit }) => {
  const [assignment, setAssignment] = useState({
    name: "",
    course: "",
    deadline: "",
    estimatedHours: "",
    status: "Not Started",
  });

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(assignment);
    setAssignment({ name: "", course: "", deadline: "", estimatedHours: "", status: "Not Started" });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Assignment Name"
            value={assignment.name}
            onChange={handleChange}
            required
          />
          <Input
            name="course"
            placeholder="Course Name"
            value={assignment.course}
            onChange={handleChange}
            required
          />
          <Input
            name="deadline"
            type="date"
            value={assignment.deadline}
            onChange={handleChange}
            required
          />
          <Input
            name="estimatedHours"
            type="number"
            placeholder="Estimated Hours"
            value={assignment.estimatedHours}
            onChange={handleChange}
            required
          />
          <Select name="status" value={assignment.status} onValueChange={(value) => setAssignment({ ...assignment, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Add Assignment</Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Component for the assignment list
const AssignmentList = ({ assignments, onSelect }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment, index) => (
              <TableRow key={index} onClick={() => onSelect(assignment)} className="cursor-pointer hover:bg-gray-100">
                <TableCell>{assignment.name}</TableCell>
                <TableCell>{assignment.course}</TableCell>
                <TableCell>{assignment.deadline}</TableCell>
                <TableCell>{assignment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Component for the assignment details
const AssignmentDetails = ({ assignment }) => {
  if (!assignment) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Assignment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Name:</strong> {assignment.name}</p>
        <p><strong>Course:</strong> {assignment.course}</p>
        <p><strong>Deadline:</strong> {assignment.deadline}</p>
        <p><strong>Estimated Hours:</strong> {assignment.estimatedHours}</p>
        <p><strong>Status:</strong> {assignment.status}</p>
      </CardContent>
    </Card>
  );
};

// Component for the Gantt chart
const GanttChart = ({ assignments }) => {
  const sortedAssignments = useMemo(() => {
    return [...assignments].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [assignments]);

  const earliestDate = useMemo(() => {
    return sortedAssignments.length > 0 ? new Date(sortedAssignments[0].deadline) : new Date();
  }, [sortedAssignments]);

  const latestDate = useMemo(() => {
    return sortedAssignments.length > 0 ? new Date(sortedAssignments[sortedAssignments.length - 1].deadline) : new Date();
  }, [sortedAssignments]);

  const totalDays = Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <Card className="mt-6 overflow-x-auto">
      <CardHeader>
        <CardTitle>Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ minWidth: `${totalDays * 30}px` }}>
          {sortedAssignments.map((assignment, index) => {
            const startDate = new Date(assignment.deadline);
            startDate.setDate(startDate.getDate() - Math.ceil(assignment.estimatedHours / 24));
            const startOffset = Math.max(0, Math.ceil((startDate - earliestDate) / (1000 * 60 * 60 * 24)));
            const duration = Math.ceil(assignment.estimatedHours / 24);
            
            return (
              <div key={index} className="flex items-center mb-2">
                <div className="w-1/4 pr-2 text-sm">{assignment.name}</div>
                <div className="w-3/4 h-6 bg-gray-200 relative">
                  <div
                    className="absolute h-full"
                    style={{
                      left: `${(startOffset / totalDays) * 100}%`,
                      width: `${(duration / totalDays) * 100}%`,
                      backgroundColor: assignment.status === "Completed" ? "green" : assignment.status === "In Progress" ? "yellow" : "red",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Main App component
export default function App() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (newAssignment) => {
    setAssignments([...assignments, newAssignment]);
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter(
      (assignment) =>
        assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assignments, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Assignment Tracker</h1>
      <AssignmentForm onSubmit={handleSubmit} />
      <Input
        placeholder="Search assignments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />
      <AssignmentList assignments={filteredAssignments} onSelect={setSelectedAssignment} />
      <AssignmentDetails assignment={selectedAssignment} />
      <GanttChart assignments={assignments} />
    </div>
  );
}