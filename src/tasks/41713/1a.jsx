import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Main App Component
export default function App() {
  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4">
      <Editor />
    </div>
  );
}

// Editor Component
function Editor() {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [alignment, setAlignment] = useState('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const textAreaRef = useRef(null);

  // Function to handle text area resizing
  const handleResize = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  // Count words and characters
  const wordCount = text.trim().split(/\s+/).length;
  const charCount = text.length;

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => setIsBold(!isBold)} variant={isBold ? 'default' : 'outline'}>Bold</Button>
        <Button onClick={() => setIsItalic(!isItalic)} variant={isItalic ? 'default' : 'outline'}>Italic</Button>
        <Button onClick={() => setIsUnderlined(!isUnderlined)} variant={isUnderlined ? 'default' : 'outline'}>Underline</Button>
      </div>

      <div className="flex items-center space-x-2">
        <label>Font Size:</label>
        <Input 
          type="number" 
          value={fontSize} 
          onChange={(e) => setFontSize(e.target.value)} 
          className="w-20"
        />
        <Select value={alignment} onValueChange={setAlignment}>
          <SelectItem value="left">Left</SelectItem>
          <SelectItem value="center">Center</SelectItem>
          <SelectItem value="right">Right</SelectItem>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox checked={isBulletList} onCheckedChange={setIsBulletList}>Bullet List</Checkbox>
        <Checkbox checked={isNumberedList} onCheckedChange={setIsNumberedList}>Numbered List</Checkbox>
      </div>

      <Textarea
        ref={textAreaRef}
        value={text}
        onChange={(e) => { setText(e.target.value); handleResize(); }}
        onInput={handleResize}
        className="w-full resize-none overflow-hidden"
        style={{
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderlined ? 'underline' : 'none',
          textAlign: alignment,
          fontSize: `${fontSize}px`,
          listStyleType: isBulletList ? 'disc' : isNumberedList ? 'decimal' : 'none',
        }}
      />

      <div className="text-right text-sm">
        Words: {wordCount} | Characters: {charCount}
      </div>
    </div>
  );
}