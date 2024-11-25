import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// Rich Text Editor component
const RichTextEditor = ({ value, onChange }) => {
  const applyFormat = (format) => {
    document.execCommand(format, false, null);
    onChange(document.getElementById("editor").innerHTML);
  };

  return (
    <div className="border rounded-md p-2">
      <div className="flex gap-2 mb-2">
        <Button onClick={() => applyFormat("bold")}>B</Button>
        <Button onClick={() => applyFormat("italic")}>I</Button>
        <Button onClick={() => applyFormat("underline")}>U</Button>
        <Button onClick={() => applyFormat("insertUnorderedList")}>UL</Button>
        <Button onClick={() => applyFormat("insertOrderedList")}>OL</Button>
      </div>
      <div
        id="editor"
        contentEditable
        className="min-h-[100px] p-2 border rounded-md"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.target.innerHTML)}
      />
    </div>
  );
};

// Note component
const Note = ({ note, onEdit, onDelete, onDuplicate, onToggleImportant }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <span>{note.title}</span>
        <div>
          <Checkbox
            checked={note.important}
            onCheckedChange={() => onToggleImportant(note.id)}
          />
          <Button onClick={() => onEdit(note)}>Edit</Button>
          <Button onClick={() => onDelete(note.id)}>Delete</Button>
          <Button onClick={() => onDuplicate(note)}>Duplicate</Button>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div dangerouslySetInnerHTML={{ __html: note.content }} />
      <div className="mt-2">
        {note.tags.map((tag) => (
          <Badge key={tag} className="mr-1">
            {tag}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main App component
export default function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: "", content: "", tags: [], important: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateCreated");

  // Function to add or update a note
  const saveNote = () => {
    if (currentNote.id) {
      setNotes(notes.map((note) => (note.id === currentNote.id ? { ...currentNote, lastModified: Date.now() } : note)));
    } else {
      setNotes([...notes, { ...currentNote, id: Date.now(), dateCreated: Date.now(), lastModified: Date.now() }]);
    }
    setCurrentNote({ id: null, title: "", content: "", tags: [], important: false });
  };

  // Function to delete a note
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Function to duplicate a note
  const duplicateNote = (note) => {
    const newNote = { ...note, id: Date.now(), title: `${note.title} (Copy)`, dateCreated: Date.now(), lastModified: Date.now() };
    setNotes([...notes, newNote]);
  };

  // Function to toggle important status
  const toggleImportant = (id) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, important: !note.important } : note)));
  };

  // Filter and sort notes
  const filteredAndSortedNotes = notes
    .filter((note) => note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "dateCreated") return b.dateCreated - a.dateCreated;
      if (sortBy === "lastModified") return b.lastModified - a.lastModified;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Notes App</h1>
      
      {/* Note Editor */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{currentNote.id ? "Edit Note" : "Create Note"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Title"
            value={currentNote.title}
            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
            className="mb-2"
          />
          <RichTextEditor
            value={currentNote.content}
            onChange={(content) => setCurrentNote({ ...currentNote, content })}
          />
          <Input
            placeholder="Tags (comma-separated)"
            value={currentNote.tags.join(", ")}
            onChange={(e) => setCurrentNote({ ...currentNote, tags: e.target.value.split(",").map((tag) => tag.trim()) })}
            className="mt-2"
          />
          <Button onClick={saveNote} className="mt-2">
            {currentNote.id ? "Update Note" : "Add Note"}
          </Button>
        </CardContent>
      </Card>

      {/* Search and Sort */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateCreated">Date Created</SelectItem>
            <SelectItem value="lastModified">Last Modified</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes List */}
      <div>
        {filteredAndSortedNotes.map((note) => (
          <Note
            key={note.id}
            note={note}
            onEdit={setCurrentNote}
            onDelete={deleteNote}
            onDuplicate={duplicateNote}
            onToggleImportant={toggleImportant}
          />
        ))}
      </div>
    </div>
  );
}