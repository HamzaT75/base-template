import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const positions = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "UX Designer",
  "Marketing Specialist",
];

function FormField({ label, children, error }) {
  return (
    <div className="mb-4">
      <Label className="block mb-2 text-sm font-bold">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    position: "",
  });
  const [errors, setErrors] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, position: value }));
    setErrors((prev) => ({ ...prev, position: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number should be 10 digits";
    if (!formData.coverLetter.trim())
      newErrors.coverLetter = "Cover letter is required";
    if (!formData.position) newErrors.position = "Position is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmissions((prev) => [...prev, formData]);
      handleReset();
      setIsOpen(true);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      coverLetter: "",
      position: "",
    });
    setErrors({});
  };

  const handleDelete = (index) => {
    setSubmissions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4">
            Job Application Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormField label="Name" error={errors.name}>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full"
              />
            </FormField>
            <FormField label="Email" error={errors.email}>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />
            </FormField>
            <FormField label="Phone Number" error={errors.phone}>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full"
              />
            </FormField>
            <FormField label="Cover Letter" error={errors.coverLetter}>
              <Textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full"
                rows={5}
              />
            </FormField>
            <FormField label="Position Applied For" error={errors.position}>
              <Select
                name="position"
                value={formData.position}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="flex justify-between mt-6">
              <Button type="submit">Submit</Button>
              <Button type="button" onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-8">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            {isOpen ? "Hide" : "Show"} Submissions ({submissions.length})
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {submissions.map((submission, index) => (
            <Card key={index} className="mt-4">
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-bold">{submission.name}</p>
                  <p className="text-sm">{submission.position}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}