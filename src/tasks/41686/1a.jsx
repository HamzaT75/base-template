import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Utility function to format text
const formatText = (text, format) => {
  switch(format) {
    case 'bold': return `<strong>${text}</strong>`;
    case 'italic': return `<em>${text}</em>`;
    case 'underline': return `<u>${text}</u>`;
    default: return text;
  }
};

// Note component
function Note({ note, onDelete, onEdit, onToggleImportant, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedNote, index);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        {isEditing ? (
          <Input 
            value={editedNote.title} 
            onChange={(e) => setEditedNote({...editedNote, title: e.target.value})} 
            className="mb-2"
          />
        ) : (
          <CardTitle>{note.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea 
            value={editedNote.content} 
            onChange={(e) => setEditedNote({...editedNote, content: e.target.value})}
          />
        ) : (
          <div dangerouslySetInnerHTML={{__html: formatText(note.content, note.format)}}></div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</Button>
        <div>
          <Checkbox checked={note.important} onCheckedChange={() => onToggleImportant(index)} /> Important
          <Button onClick={() => onDelete(index)} className="ml-2">Delete</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Main App component
export default function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');

  // Add or edit note
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const tag = e.target.tag.value;
    const important = e.target.important.checked;
    if (title && content) {
      setNotes([...notes, { title, content, tag, important, dateCreated: new Date(), lastModified: new Date(), format: 'normal' }]);
      e.target.reset();
    }
  };

  // Delete note
  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  // Edit note
  const editNote = (editedNote, index) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = {...editedNote, lastModified: new Date()};
    setNotes(updatedNotes);
  };

  // Toggle important status
  const toggleImportant = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].important = !updatedNotes[index].important;
    setNotes(updatedNotes);
  };

  // Sort notes
  const sortedNotes = [...notes].sort((a, b) => {
    switch(sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'lastModified': return new Date(b.lastModified) - new Date(a.lastModified);
      default: return new Date(b.dateCreated) - new Date(a.dateCreated);
    }
  });

  // Filter notes
  const filteredNotes = sortedNotes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-4">Notes App</h1>
      
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <Input 
          placeholder="Search notes..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="mb-2 sm:mb-0 sm:mr-2"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Sort By</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy('dateCreated')}>Date Created</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('lastModified')}>Last Modified</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('title')}>Title</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Add New Note Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <Input name="title" placeholder="Title" className="mb-2" required />
        <Textarea name="content" placeholder="Content" className="mb-2" required />
        <Input name="tag" placeholder="Tag" className="mb-2" />
        <Checkbox name="important">Important</Checkbox>
        <Button type="submit" className="mt-2">Add Note</Button>
      </form>

      {/* Notes List */}
      {filteredNotes.map((note, index) => (
        <Note 
          key={index} 
          note={note} 
          index={index} 
          onDelete={deleteNote} 
          onEdit={editNote} 
          onToggleImportant={toggleImportant} 
        />
      ))}
    </div>
  );
}