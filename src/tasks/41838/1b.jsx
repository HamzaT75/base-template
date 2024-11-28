import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const professions = [
  {
    name: "Mason",
    tools: "Trowel, chisel, hammer, level, mortar mixer, masonry saw, tape measure"
  },
  {
    name: "Painter",
    tools: "Paintbrushes, rollers, paint trays, drop cloths, masking tape, ladder, sandpaper, scraper"
  },
  {
    name: "Blacksmith",
    tools: "Anvil, forge, hammer, tongs, chisel, wire brush, vice"
  },
  {
    name: "Welder",
    tools: "Welding machine, protective mask, welding gloves, wire brush, clamps, angle grinder"
  },
  {
    name: "Mechanic",
    tools: "Wrenches, screwdrivers, pliers, car jack, diagnostic tools, air compressor, torque wrench"
  },
  {
    name: "Roofer",
    tools: "Roofing hammer, utility knife, ladder, measuring tape, chalk line, nail gun, roofing shingles"
  },
  {
    name: "Locksmith",
    tools: "Lock pick set, tension wrench, drill, screwdriver, key duplicator, grinder, plug spinner"
  },
  {
    name: "Tailor",
    tools: "Sewing machine, scissors, needles, measuring tape, pins, thread, iron"
  },
  {
    name: "Cobbler",
    tools: "Shoe last, hammer, awl, knife, nails, thread, adhesive, polishing tools"
  },
  {
    name: "Tile Setter",
    tools: "Tile cutter, trowel, grout float, spirit level, measuring tape, spacers, sponge"
  },
  {
    name: "HVAC Technician",
    tools: "Multimeter, screwdrivers, pliers, HVAC gauges, vacuum pump, duct tape, thermometer"
  },
  {
    name: "Pest Control Specialist",
    tools: "Sprayers, traps, bait stations, protective gloves, respirator mask, insecticides, vacuum"
  },
  {
    name: "Butcher",
    tools: "Knives, cleaver, meat saw, cutting board, grinder, scales, meat hooks"
  },
  {
    name: "Baker",
    tools: "Mixing bowls, rolling pins, oven, dough scraper, pastry brush, measuring cups, whisk"
  },
  {
    name: "Glass Installer/Glazier",
    tools: "Glass cutter, putty knife, suction cups, glazing tools, hammer, pliers, tape measure"
  }
];

const ProfessionCheckbox = ({ profession, isChecked, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={profession.name}
        checked={isChecked}
        onCheckedChange={() => onChange(profession.name)}
      />
      <label
        htmlFor={profession.name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {profession.name}
      </label>
    </div>
  );
};

const ToolCard = ({ profession }) => {
  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle className="text-lg">{profession.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{profession.tools}</p>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [selectedProfessions, setSelectedProfessions] = useState([]);

  const handleProfessionToggle = (professionName) => {
    setSelectedProfessions((prev) =>
      prev.includes(professionName)
        ? prev.filter((name) => name !== professionName)
        : [...prev, professionName]
    );
  };

  const handleDeselectAll = () => {
    setSelectedProfessions([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DIY Tools Recommender</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Professions:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {professions.map((profession) => (
            <ProfessionCheckbox
              key={profession.name}
              profession={profession}
              isChecked={selectedProfessions.includes(profession.name)}
              onChange={handleProfessionToggle}
            />
          ))}
        </div>
        <Button onClick={handleDeselectAll} className="mt-4">
          Deselect All
        </Button>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Recommended Tools:</h2>
        <div className="flex flex-wrap justify-start">
          {selectedProfessions.map((professionName) => {
            const profession = professions.find((p) => p.name === professionName);
            return <ToolCard key={profession.name} profession={profession} />;
          })}
        </div>
      </div>
    </div>
  );
}