import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MAX_CHARS = 50;

const SmartTextInput = () => {
  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validateInput = useCallback((input) => {
    const alphabeticRegex = /^[a-zA-Z]*$/;
    return alphabeticRegex.test(input) && input.length <= MAX_CHARS;
  }, []);

  const handleInputChange = useCallback((e) => {
    const newText = e.target.value;
    setText(newText);
    setIsValid(validateInput(newText));
  }, [validateInput]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Smart Text Input
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter some text"
              value={text}
              onChange={handleInputChange}
              maxLength={MAX_CHARS}
              className={`w-full p-2 border-2 rounded-md ${
                isValid ? "border-green-500" : "border-red-500"
              }`}
            />
            <div className="flex justify-between text-sm">
              <span className={isValid ? "text-green-600" : "text-red-600"}>
                {isValid ? "Valid input" : "Invalid input"}
              </span>
              <span className="text-gray-600">
                {text.length}/{MAX_CHARS}
              </span>
            </div>
            {!isValid && (
              <p className="text-red-500 text-sm">
                Please enter only alphabetic characters (max 50).
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <SmartTextInput />;
}