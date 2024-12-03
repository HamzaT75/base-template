import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function TextGuardWidget() {
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('white');
  const MAX_CHARS = 200;

  const handleTextChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
    }
  };

  const handleClear = () => {
    setText('');
  };

  const toggleBold = () => {
    setText(prevText => {
      const selectionStart = document.activeElement.selectionStart;
      const selectionEnd = document.activeElement.selectionEnd;
      const newText = prevText.slice(0, selectionStart) + `**${prevText.slice(selectionStart, selectionEnd)}**` + prevText.slice(selectionEnd);
      return newText;
    });
  };

  const toggleItalic = () => {
    setText(prevText => {
      const selectionStart = document.activeElement.selectionStart;
      const selectionEnd = document.activeElement.selectionEnd;
      const newText = prevText.slice(0, selectionStart) + `*${prevText.slice(selectionStart, selectionEnd)}*` + prevText.slice(selectionEnd);
      return newText;
    });
  };

  const wordCount = text.trim().split(/\s+/).length;

  return (
    <div className="p-4 max-w-lg mx-auto sm:w-full">
      <Textarea 
        value={text} 
        onChange={handleTextChange} 
        placeholder="Enter some text"
        className="mb-4 w-full h-40 resize-none"
        style={{ backgroundColor: bgColor }}
      />
      <div className="flex justify-between mb-2">
        <div>
          <Button variant="outline" onClick={() => setBgColor('white')} className="mr-2">White</Button>
          <Button variant="outline" onClick={() => setBgColor('#E5E7EB')}>Gray</Button>
          <Button variant="outline" onClick={() => setBgColor('#F3F4F6')} className="ml-2">Light</Button>
        </div>
        <div>
          <Button variant="outline" onClick={toggleBold} className="mr-2">Bold</Button>
          <Button variant="outline" onClick={toggleItalic}>Italic</Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Characters: {text.length}/{MAX_CHARS} | Words: {wordCount}
        </p>
        <Button size="sm" onClick={handleClear}>Clear</Button>
      </div>
      {text.length > MAX_CHARS && (
        <p className="text-red-500 text-sm mt-2">Character limit exceeded!</p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <TextGuardWidget />
    </div>
  );
}