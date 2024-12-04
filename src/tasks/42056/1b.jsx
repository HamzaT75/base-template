import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SearchResult = ({ text, searchTerm, caseSensitive }) => {
  if (!searchTerm) return <>{text}</>;

  const regex = new RegExp(searchTerm, caseSensitive ? "g" : "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span
              className={`${
                caseSensitive ? "bg-green-300" : "bg-blue-300"
              } rounded px-1`}
            >
              {text.match(regex)[i]}
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default function App() {
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);

  const handleSearch = useCallback(
    (isCaseSensitive) => {
      setCaseSensitive(isCaseSensitive);
    },
    []
  );

  const handleReset = useCallback(() => {
    setText("");
    setSearchTerm("");
    setCaseSensitive(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Smart Search Bar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="text-area" className="block text-sm font-medium text-gray-700 mb-1">
              Text Area
            </label>
            <Textarea
              id="text-area"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-40"
            />
          </div>
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <Input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term..."
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleSearch(true)}>Case Sensitive</Button>
            <Button onClick={() => handleSearch(false)}>Case Insensitive</Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
          <div className="bg-white p-4 rounded-md border">
            <h3 className="text-lg font-semibold mb-2">Search Result:</h3>
            <p className="whitespace-pre-wrap">
              <SearchResult
                text={text}
                searchTerm={searchTerm}
                caseSensitive={caseSensitive}
              />
            </p>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          Search is {caseSensitive ? "case sensitive" : "case insensitive"}
        </CardFooter>
      </Card>
    </div>
  );
}