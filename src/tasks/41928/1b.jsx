import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Main App component
export default function App() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to add a new meeting
  const addMeeting = (meeting) => {
    setMeetings([...meetings, meeting]);
  };

  // Function to filter meetings based on search term
  const filteredMeetings = meetings.filter((meeting) =>
    meeting.agenda.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Meetings Management App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MeetingForm onAddMeeting={addMeeting} />
        <div>
          <Input
            type="text"
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <MeetingList
            meetings={filteredMeetings}
            onSelectMeeting={setSelectedMeeting}
          />
        </div>
      </div>
      {selectedMeeting && (
        <MeetingDetails meeting={selectedMeeting} className="mt-4" />
      )}
      <GanttChart meetings={meetings} className="mt-8" />
    </div>
  );
}

// Component for the meeting input form
function MeetingForm({ onAddMeeting }) {
  const [agenda, setAgenda] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMeeting({ agenda, startTime, endTime, priority });
    setAgenda("");
    setStartTime("");
    setEndTime("");
    setPriority("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Meeting</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Agenda"
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            required
          />
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
          <Select onValueChange={setPriority} required>
            <SelectTrigger>
              <SelectValue placeholder="Priority Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Add Meeting</Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Component to display the list of meetings
function MeetingList({ meetings, onSelectMeeting }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meetings List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {meetings.map((meeting, index) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => onSelectMeeting(meeting)}
            >
              {meeting.agenda}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// Component to display detailed view of a selected meeting
function MeetingDetails({ meeting }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Agenda:</strong> {meeting.agenda}</p>
        <p><strong>Start Time:</strong> {meeting.startTime}</p>
        <p><strong>End Time:</strong> {meeting.endTime}</p>
        <p><strong>Priority:</strong> {meeting.priority}</p>
      </CardContent>
    </Card>
  );
}

// Component to display the Gantt Chart
function GanttChart({ meetings }) {
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

  const getPosition = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours - 8 + minutes / 60) / 12 * 100;
  };

  const getWidth = (start, end) => {
    const startPos = getPosition(start);
    const endPos = getPosition(end);
    return endPos - startPos;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="absolute top-0 bottom-0 border-l border-gray-200"
              style={{ left: `${((hour - 8) / 12) * 100}%` }}
            >
              <span className="absolute -top-6 text-xs">{`${hour}:00`}</span>
            </div>
          ))}
          {meetings.map((meeting, index) => (
            <div
              key={index}
              className="absolute h-8 bg-blue-500 text-white text-xs flex items-center justify-center overflow-hidden"
              style={{
                left: `${getPosition(meeting.startTime)}%`,
                width: `${getWidth(meeting.startTime, meeting.endTime)}%`,
                top: `${index * 40 + 20}px`,
              }}
            >
              {meeting.agenda}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}