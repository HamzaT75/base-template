import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const namedColors = {
  "#FF0000": "Red",
  "#00FF00": "Lime",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#00FFFF": "Cyan",
  "#FF00FF": "Magenta",
  "#C0C0C0": "Silver",
  "#808080": "Gray",
  "#800000": "Maroon",
  "#808000": "Olive",
  "#008000": "Green",
  "#800080": "Purple",
  "#008080": "Teal",
  "#000080": "Navy",
};

const ColorPreview = ({ color, opacity }) => (
  <div
    className="w-full h-64 rounded-lg shadow-md"
    style={{ backgroundColor: color, opacity }}
  ></div>
);

const ColorCodes = ({ color, opacity }) => {
  const hex = color.slice(1);
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

  return (
    <div className="space-y-2">
      <p>HEX: {color}</p>
      <p>RGB: rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
      <p>
        HSL: hsl({Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}
        %)
      </p>
      <p>RGBA: {rgba}</p>
    </div>
  );
};

const ColorInput = ({ color, setColor }) => {
  const [inputColor, setInputColor] = useState(color);

  const handleChange = (e) => {
    setInputColor(e.target.value);
    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
      setColor(e.target.value);
    }
  };

  useEffect(() => {
    setInputColor(color);
  }, [color]);

  return (
    <Input
      type="text"
      value={inputColor}
      onChange={handleChange}
      placeholder="Enter HEX code"
      className="w-full"
    />
  );
};

const OpacitySlider = ({ opacity, setOpacity }) => (
  <Slider
    min={0}
    max={1}
    step={0.01}
    value={[opacity]}
    onValueChange={([value]) => setOpacity(value)}
    className="w-full"
  />
);

const RandomColorButton = ({ setColor }) => {
  const generateRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setColor(`#${randomColor.padStart(6, "0")}`);
  };

  return (
    <Button onClick={generateRandomColor} className="w-full">
      Generate Random Color
    </Button>
  );
};

const NamedColor = ({ color }) => {
  const getClosestNamedColor = (hexColor) => {
    let closestColor = null;
    let minDistance = Infinity;

    for (const [namedHex, colorName] of Object.entries(namedColors)) {
      const distance = colorDistance(hexColor, namedHex);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = colorName;
      }
    }

    return closestColor;
  };

  const closestColor = getClosestNamedColor(color);

  return <p>Closest named color: {closestColor}</p>;
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function colorDistance(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );
}

export default function App() {
  const [color, setColor] = useState("#FF0000");
  const [opacity, setOpacity] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Color Picker App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPreview color={color} opacity={opacity} />
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10"
          />
          <ColorCodes color={color} opacity={opacity} />
          <ColorInput color={color} setColor={setColor} />
          <div className="space-y-2">
            <p>Opacity: {opacity.toFixed(2)}</p>
            <OpacitySlider opacity={opacity} setOpacity={setOpacity} />
          </div>
          <RandomColorButton setColor={setColor} />
          <NamedColor color={color} />
        </CardContent>
      </Card>
    </div>
  );
}