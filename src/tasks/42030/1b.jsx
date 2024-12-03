// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Slider } from "@/components/ui/slider";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// const namedColors = {
//   "Sky Blue": "#87CEEB",
//   // Add more named colors as needed
// };

// function findClosestColor(color) {
//   let closest = null;
//   let closestDistance = Infinity;
//   for (const [name, hex] of Object.entries(namedColors)) {
//     const distance = colorDistance(color, hex);
//     if (distance < closestDistance) {
//       closestDistance = distance;
//       closest = name;
//     }
//   }
//   return closest;
// }

// function colorDistance(color1, color2) {
//   const rgb1 = hexToRgb(color1);
//   const rgb2 = hexToRgb(color2);
//   return Math.sqrt(
//     Math.pow(rgb1.r - rgb2.r, 2) +
//     Math.pow(rgb1.g - rgb2.g, 2) +
//     Math.pow(rgb1.b - rgb2.b, 2)
//   );
// }

// function hexToRgb(hex) {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result ? {
//     r: parseInt(result[1], 16),
//     g: parseInt(result[2], 16),
//     b: parseInt(result[3], 16)
//   } : null;
// }

// function rgbToHex(r, g, b) {
//   return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
// }

// function rgbToHsl(r, g, b) {
//   r /= 255, g /= 255, b /= 255;
//   const max = Math.max(r, g, b), min = Math.min(r, g, b);
//   let h, s, l = (max + min) / 2;

//   if(max == min) {
//     h = s = 0; // achromatic
//   } else {
//     const d = max - min;
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//     switch(max) {
//       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//       case g: h = (b - r) / d + 2; break;
//       case b: h = (r - g) / d + 4; break;
//     }
//     h /= 6;
//   }

//   return [h * 360, s * 100, l * 100];
// }

// export default function App() {
//   const [color, setColor] = useState('#ff0000');
//   const [opacity, setOpacity] = useState(1);
//   const rgb = hexToRgb(color);
//   const [h, s, l] = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : [0, 0, 0];

//   const handleColorChange = (e) => {
//     setColor(e.target.value);
//   };

//   const generateRandomColor = () => {
//     const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
//     setColor(randomColor);
//   };

//   const rgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : '';

//   useEffect(() => {
//     if (rgb) {
//       const closestName = findClosestColor(color);
//       document.title = `${closestName} - Color Picker`;
//     }
//   }, [color]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-lg">
//         <CardHeader>
//           <CardTitle>Color Picker</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div 
//             style={{ backgroundColor: rgba }} 
//             className="w-full h-64 border border-gray-300 rounded-lg"
//           ></div>
//           <div className="flex flex-col space-y-2">
//             <Input type="color" value={color} onChange={handleColorChange} />
//             <Input 
//               type="text" 
//               value={color} 
//               onChange={handleColorChange} 
//               placeholder="Enter HEX color"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p>HEX: {color}</p>
//               <p>RGB: {rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : ''}</p>
//             </div>
//             <div>
//               <p>HSL: {rgb ? `${h.toFixed(0)}°, ${s.toFixed(0)}%, ${l.toFixed(0)}%` : ''}</p>
//               <p>Closest: {findClosestColor(color)}</p>
//             </div>
//           </div>
//           <Slider 
//             defaultValue={[100]} 
//             max={100} 
//             onValueChange={(value) => setOpacity(value[0] / 100)}
//             className="w-full"
//           />
//           <p>Opacity: {opacity.toFixed(2)} - RGBA: {rgba}</p>
//           <Button onClick={generateRandomColor}>Random Color</Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }