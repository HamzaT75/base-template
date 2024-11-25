import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";

// Icons for formatting buttons
const BoldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>;
const ItalicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>;
const UnderlineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>;
const AlignLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>;
const AlignCenterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>;
const AlignRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>;
const ListBulletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const ListNumberedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>;

export default function App() {
  const [text, setText] = useState("");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [fontSize, setFontSize] = useState("16");
  const [alignment, setAlignment] = useState("left");
  const [listType, setListType] = useState("none");

  // Function to count words and characters
  const countWordsAndChars = useCallback(() => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    return { words, chars };
  }, [text]);

  // Function to handle text formatting
  const handleFormat = (format) => {
    switch (format) {
      case "bold":
        setBold(!bold);
        break;
      case "italic":
        setItalic(!italic);
        break;
      case "underline":
        setUnderline(!underline);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Text Editor</h1>
      
      {/* Formatting toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Toggle pressed={bold} onPressedChange={() => handleFormat("bold")}><BoldIcon /></Toggle>
        <Toggle pressed={italic} onPressedChange={() => handleFormat("italic")}><ItalicIcon /></Toggle>
        <Toggle pressed={underline} onPressedChange={() => handleFormat("underline")}><UnderlineIcon /></Toggle>
        
        <Select value={fontSize} onValueChange={setFontSize}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Font Size" />
          </SelectTrigger>
          <SelectContent>
            {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
              <SelectItem key={size} value={size.toString()}>{size}px</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={alignment} onValueChange={setAlignment}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Align" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left"><AlignLeftIcon /></SelectItem>
            <SelectItem value="center"><AlignCenterIcon /></SelectItem>
            <SelectItem value="right"><AlignRightIcon /></SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={listType} onValueChange={setListType}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="List" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="bullet"><ListBulletIcon /></SelectItem>
            <SelectItem value="number"><ListNumberedIcon /></SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Text area */}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[200px] resize-y mb-4"
        style={{
          fontWeight: bold ? "bold" : "normal",
          fontStyle: italic ? "italic" : "normal",
          textDecoration: underline ? "underline" : "none",
          fontSize: `${fontSize}px`,
          textAlign: alignment,
          listStyleType: listType === "bullet" ? "disc" : listType === "number" ? "decimal" : "none",
          paddingLeft: listType !== "none" ? "20px" : "0",
        }}
      />
      
      {/* Word and character count */}
      <div className="text-sm text-gray-600">
        Words: {countWordsAndChars().words}, Characters: {countWordsAndChars().chars}
      </div>
    </div>
  );
}