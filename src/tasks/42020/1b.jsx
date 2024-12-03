import React, { useState, useCallback } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MAX_CHARS = 200;

const ColorOption = ({ color, label, selectedColor, onChange }) => (
  <div className="flex items-center space-x-2">
    <RadioGroupItem value={color} id={color} checked={selectedColor === color} onChange={onChange} />
    <Label htmlFor={color} className="flex items-center space-x-2 cursor-pointer">
      <div className={`w-4 h-4 rounded-full bg-${color}-500`}></div>
      <span>{label}</span>
    </Label>
  </div>
);

const FormatButton = ({ format, icon, isActive, onClick }) => (
  <Button
    variant="outline"
    size="sm"
    className={`p-2 ${isActive ? "bg-gray-200" : ""}`}
    onClick={() => onClick(format)}
  >
    {icon}
  </Button>
);

export default function App() {
  const [text, setText] = useState("");
  const [bgColor, setBgColor] = useState("white");
  const [activeFormats, setActiveFormats] = useState([]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };

  const handleClear = () => {
    setText("");
    setActiveFormats([]);
  };

  const toggleFormat = useCallback((format) => {
    setActiveFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  }, []);

  const applyFormats = (text) => {
    let formattedText = text;
    if (activeFormats.includes("bold")) formattedText = `**${formattedText}**`;
    if (activeFormats.includes("italic")) formattedText = `*${formattedText}*`;
    return formattedText;
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4">Text Guard Widget</h2>
          <Textarea
            placeholder="Enter some text"
            value={text}
            onChange={handleTextChange}
            className={`w-full h-32 p-2 border rounded bg-${bgColor}`}
          />
          {text.length > MAX_CHARS && (
            <Alert variant="destructive">
              <AlertDescription>
                Text exceeds the maximum character limit of {MAX_CHARS}.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              {text.length}/{MAX_CHARS} characters
            </span>
            <span>{wordCount} words</span>
          </div>
          <div className="flex space-x-2">
            <FormatButton
              format="bold"
              icon="B"
              isActive={activeFormats.includes("bold")}
              onClick={toggleFormat}
            />
            <FormatButton
              format="italic"
              icon="I"
              isActive={activeFormats.includes("italic")}
              onClick={toggleFormat}
            />
          </div>
          <RadioGroup
            value={bgColor}
            onValueChange={setBgColor}
            className="flex flex-col space-y-1"
          >
            <ColorOption color="white" label="White" selectedColor={bgColor} onChange={() => setBgColor("white")} />
            <ColorOption color="gray" label="Gray" selectedColor={bgColor} onChange={() => setBgColor("gray")} />
            <ColorOption color="yellow" label="Yellow" selectedColor={bgColor} onChange={() => setBgColor("yellow")} />
          </RadioGroup>
          <Button onClick={handleClear} variant="outline" size="sm" className="mt-2">
            Clear
          </Button>
        </CardContent>
        <CardFooter>
          <div className="w-full p-2 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Formatted Text Preview:</h3>
            <p className="whitespace-pre-wrap">{applyFormats(text)}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}