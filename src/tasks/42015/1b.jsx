import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SmartTextInput() {
  const [text, setText] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleTextChange = (e) => {
    let inputText = e.target.value;
    // Allow only alphabetic characters
    if (/^[a-zA-Z]*$/.test(inputText)) {
      if (inputText.length <= 50) {
        setText(inputText);
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } else if (inputText === '') {
      setText('');
      setIsValid(true);
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-full max-w-sm mx-auto p-4">
      <Label htmlFor="smart-input">Smart Text Input</Label>
      <Input
        id="smart-input"
        placeholder="Enter some text."
        value={text}
        onChange={handleTextChange}
        className={`border-2 ${isValid ? 'border-green-500' : 'border-red-500'} focus:outline-none focus:ring-2 focus:ring-green-500`}
      />
      <div className="text-sm text-right">
        Characters: {text.length}/50
      </div>
      {!isValid && (
        <p className="text-red-500 text-xs">
          {text.length > 50 ? 'Character limit exceeded!' : 'Only alphabetic characters are allowed!'}
        </p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <SmartTextInput />
      </div>
    </div>
  );
}