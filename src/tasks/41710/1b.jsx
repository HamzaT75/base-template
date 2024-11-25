import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Event form component
const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(event || {
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    isPublic: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        placeholder="Event Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <Textarea
        name="description"
        placeholder="Event Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <Input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <Input
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <Input
        name="time"
        type="time"
        value={formData.time}
        onChange={handleChange}
        required
      />
      <div className="flex items-center space-x-2">
        <Switch
          id="public"
          checked={formData.isPublic}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isPublic: checked }))
          }
        />
        <label htmlFor="public">Public Event</label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Event</Button>
      </div>
    </form>
  );
};

// Event card component
const EventCard = ({ event, onEdit, onDelete, onDuplicate }) => {
  return (
    <Card className="w-full sm:w-64">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">{event.description}</p>
        <p className="text-sm">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="text-sm">
          <strong>Date:</strong> {event.date}
        </p>
        <p className="text-sm">
          <strong>Time:</strong> {event.time}
        </p>
        <p className="text-sm">
          <strong>Visibility:</strong> {event.isPublic ? "Public" : "Private"}
        </p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button size="sm" variant="outline" onClick={() => onEdit(event)}>
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDuplicate(event)}>
            Duplicate
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(event.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main App component
export default function App() {
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const handleAddEvent = (newEvent) => {
    setEvents((prev) => [...prev, { ...newEvent, id: Date.now() }]);
    setIsDialogOpen(false);
  };

  const handleEditEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setIsDialogOpen(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const handleDuplicateEvent = (event) => {
    const duplicatedEvent = { ...event, id: Date.now(), title: `Copy of ${event.title}` };
    setEvents((prev) => [...prev, duplicatedEvent]);
  };

  const upcomingEvents = events.filter(
    (event) => new Date(`${event.date}T${event.time}`) > new Date()
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Event Planning App</h1>
      <Button onClick={() => {
        setCurrentEvent(null);
        setIsDialogOpen(true);
      }}>
        Add New Event
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>
          <EventForm
            event={currentEvent}
            onSubmit={currentEvent ? handleEditEvent : handleAddEvent}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {upcomingEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={(event) => {
              setCurrentEvent(event);
              setIsDialogOpen(true);
            }}
            onDelete={handleDeleteEvent}
            onDuplicate={handleDuplicateEvent}
          />
        ))}
      </div>
    </div>
  );
}