import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function App() {
  const [text, setText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const textAreaRef = useRef(null);

  const highlightText = (caseSensitive) => {
    if (!searchTerm) return;
    const textValue = textAreaRef.current.value;
    const regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
    const newText = textValue.replace(regex, match => `<span style="background-color: ${caseSensitive ? 'green' : 'blue'};">${match}</span>`);
    textAreaRef.current.innerHTML = newText;
    // Here we're directly manipulating the DOM for highlighting, which isn't typical in React but simplifies this example.
  };

  const handleSearch = (caseSensitive) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    const regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
    const found = text.match(regex) || [];
    setResults(found);
    highlightText(caseSensitive);
  };

  const resetFields = () => {
    setText('');
    setSearchTerm('');
    setResults([]);
    if (textAreaRef.current) textAreaRef.current.innerHTML = ''; // Clear highlights
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:p-4">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md sm:w-96">
        <Textarea 
          ref={textAreaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          className="mb-4 h-48"
        />
        <Input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for..."
          className="mb-4"
        />
        <div className="flex justify-between mb-4">
          <Button onClick={() => handleSearch(true)} variant="outline" className="mr-2">
            Case Sensitive
          </Button>
          <Button onClick={() => handleSearch(false)} variant="outline">
            Case Insensitive
          </Button>
        </div>
        <Button onClick={resetFields} variant="destructive">
          Reset
        </Button>
        {results.length > 0 && (
          <p className="mt-4 text-sm text-gray-600">
            Found {results.length} match{results.length > 1 ? 'es' : ''}.
          </p>
        )}
      </div>
    </div>
  );
}