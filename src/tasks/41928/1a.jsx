import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function App() {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({ agenda: '', startTime: '', endTime: '', priority: 'Medium' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.agenda && form.startTime && form.endTime) {
      setMeetings([...meetings, { ...form, id: Date.now() }]);
      setForm({ agenda: '', startTime: '', endTime: '', priority: 'Medium' });
    }
  };

  // Filter meetings based on the search term
  const filteredMeetings = useMemo(() => 
    meetings.filter(meeting => 
      meeting.agenda.toLowerCase().includes(searchTerm.toLowerCase())
    ), [meetings, searchTerm]);

  // Function to render Gantt chart
  const renderGanttChart = () => {
    const hours = Array.from({length: 13}, (_, i) => i + 8); // 8 AM to 8 PM
    return (
      <div className="mt-4 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Daily Meetings Gantt Chart</h2>
        <div className="grid grid-cols-13 gap-2">
          {hours.map(hour => (
            <div key={hour} className="text-center text-xs border-l border-t last:border-r">
              {hour}:00
            </div>
          ))}
          {meetings.map(meeting => (
            <div key={meeting.id} className="col-span-12 relative" style={{ gridColumn: `${meeting.startTime.slice(0,2) - 7}/${meeting.endTime.slice(0,2) - meeting.startTime.slice(0,2)}` }}>
              <div className={`absolute h-4 bg-${meeting.priority === 'High' ? 'red' : meeting.priority === 'Medium' ? 'yellow' : 'green'}-500 rounded`} style={{ 
                width: `${(parseInt(meeting.endTime) - parseInt(meeting.startTime)) * 100 / 12}%`, 
                left: `${(parseInt(meeting.startTime) - 8) * 100 / 12}%` }}>
                {meeting.agenda}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:px-8">
      <h1 className="text-2xl font-bold mb-4">Daily Meetings Manager</h1>
      
      {/* Meeting Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2 mb-2">
              <Label htmlFor="agenda">Agenda</Label>
              <Input id="agenda" value={form.agenda} onChange={e => setForm({...form, agenda: e.target.value})} placeholder="Meeting Topic" required />
            </div>
            <div className="grid gap-2 mb-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input type="time" id="startTime" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required />
            </div>
            <div className="grid gap-2 mb-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input type="time" id="endTime" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required />
            </div>
            <div className="grid gap-2 mb-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={value => setForm({...form, priority: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add Meeting</Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="mt-4">
        <Input 
          type="text" 
          placeholder="Search by agenda..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Meetings List */}
      <div className="mt-4">
        {filteredMeetings.map(meeting => (
          <Card key={meeting.id} className="mb-2 cursor-pointer" onClick={() => setSelectedMeeting(meeting)}>
            <CardContent>
              <p><strong>{meeting.agenda}</strong> - {meeting.startTime} to {meeting.endTime}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      {selectedMeeting && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Agenda:</strong> {selectedMeeting.agenda}</p>
            <p><strong>Time:</strong> {selectedMeeting.startTime} - {selectedMeeting.endTime}</p>
            <p><strong>Priority:</strong> {selectedMeeting.priority}</p>
          </CardContent>
        </Card>
      )}

      {/* Gantt Chart */}
      {meetings.length > 0 && renderGanttChart()}
    </div>
  );
}