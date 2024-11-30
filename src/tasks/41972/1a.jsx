import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

const NoteForm = ({ addNote, editingNote, updateNote, resetForm }) => {
  const [title, setTitle] = useState(editingNote?.title || "");
  const [content, setContent] = useState(editingNote?.content || "");
  const [category, setCategory] = useState(editingNote?.category || "");
  const [createdDate, setCreatedDate] = useState(editingNote?.createdDate || "");
  const [lastModifiedDate, setLastModifiedDate] = useState(editingNote?.lastModifiedDate || "");
  const [priority, setPriority] = useState(editingNote?.priority || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const note = {
      id: editingNote?.id || Date.now(),
      title,
      content,
      category,
      createdDate,
      lastModifiedDate,
      priority,
    };
    if (editingNote) {
      updateNote(note);
    } else {
      addNote(note);
    }
    resetForm();
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setCreatedDate("");
    setLastModifiedDate("");
    setPriority("");
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Note Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the note's title"
          minLength={3}
          maxLength={100}
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter note content"
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Work">Work</SelectItem>
            <SelectItem value="Personal">Personal</SelectItem>
            <SelectItem value="Hobbies">Hobbies</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="createdDate">Created Date</Label>
        <Input
          id="createdDate"
          type="date"
          value={createdDate}
          onChange={(e) => setCreatedDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="lastModifiedDate">Last Modified Date</Label>
        <Input
          id="lastModifiedDate"
          type="date"
          value={lastModifiedDate}
          onChange={(e) => setLastModifiedDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Priority</Label>
        <RadioGroup value={priority} onValueChange={setPriority} required>
          <div className="flex space-x-2">
            <RadioGroupItem value="Low" id="low" />
            <Label htmlFor="low">Low</Label>
          </div>
          <div className="flex space-x-2">
            <RadioGroupItem value="Medium" id="medium" />
            <Label htmlFor="medium">Medium</Label>
          </div>
          <div className="flex space-x-2">
            <RadioGroupItem value="High" id="high" />
            <Label htmlFor="high">High</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex space-x-2">
        <Button type="submit">{editingNote ? "Update" : "Submit"}</Button>
        <Button type="button" onClick={handleReset} variant="outline">
          Reset
        </Button>
      </div>
    </form>
  );
};

const NoteList = ({ notes, deleteNote, editNote }) => {
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {note.title}
              <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{note.content}</p>
            <p>Category: {note.category}</p>
            <p>Created: {note.createdDate}</p>
            <p>Last Modified: {note.lastModifiedDate}</p>
            <p>Priority: {note.priority}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => editNote(note)}>Edit</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const addNote = (note) => {
    setNotes([...notes, note]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (note) => {
    setEditingNote(note);
  };

  const updateNote = (updatedNote) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
    setEditingNote(null);
  };

  const resetForm = () => {
    setEditingNote(null);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Smart Notes App</h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{editingNote ? "Edit Note" : "Create Note"}</CardTitle>
          </CardHeader>
          <CardContent>
            <NoteForm
              addNote={addNote}
              editingNote={editingNote}
              updateNote={updateNote}
              resetForm={resetForm}
            />
          </CardContent>
        </Card>
        <NoteList notes={notes} deleteNote={deleteNote} editNote={editNote} />
      </div>
    </div>
  );
}