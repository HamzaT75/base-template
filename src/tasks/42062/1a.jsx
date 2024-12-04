import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const initialFormState = {
  departureCity: "",
  destinationCity: "",
  journeyDate: "",
  departureTime: "",
  numPassengers: "",
  age: "",
  phoneNo: "",
  seatNo: "",
};

export default function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.departureCity) newErrors.departureCity = "Required";
    if (!formData.destinationCity) newErrors.destinationCity = "Required";
    if (!formData.journeyDate) newErrors.journeyDate = "Required";
    if (new Date(formData.journeyDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.journeyDate = "Date must be today or in the future";
    }
    if (!formData.departureTime) newErrors.departureTime = "Required";
    if (!formData.numPassengers || formData.numPassengers < 1) {
      newErrors.numPassengers = "Must be at least 1";
    }
    if (!formData.age || formData.age < 1) newErrors.age = "Invalid age";
    if (!formData.phoneNo || !/^\d{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = "Must be 10 digits";
    }
    if (!formData.seatNo || formData.seatNo < 1) {
      newErrors.seatNo = "Invalid seat number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setSubmitted(false);
  };

  const totalAmount = formData.numPassengers * 100;

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bus Seat Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Departure City"
                name="departureCity"
                value={formData.departureCity}
                onChange={handleChange}
                error={errors.departureCity}
              />
              <FormField
                label="Destination City"
                name="destinationCity"
                value={formData.destinationCity}
                onChange={handleChange}
                error={errors.destinationCity}
              />
              <FormField
                label="Journey Date"
                name="journeyDate"
                type="date"
                value={formData.journeyDate}
                onChange={handleChange}
                error={errors.journeyDate}
              />
              <FormField
                label="Departure Time"
                name="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={handleChange}
                error={errors.departureTime}
              />
              <FormField
                label="Number of Passengers"
                name="numPassengers"
                type="number"
                value={formData.numPassengers}
                onChange={handleChange}
                error={errors.numPassengers}
              />
              <FormField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                error={errors.age}
              />
              <FormField
                label="Phone Number"
                name="phoneNo"
                type="tel"
                value={formData.phoneNo}
                onChange={handleChange}
                error={errors.phoneNo}
              />
              <FormField
                label="Seat Number"
                name="seatNo"
                type="number"
                value={formData.seatNo}
                onChange={handleChange}
                error={errors.seatNo}
              />
            </div>
            <div className="flex justify-between mt-6">
              <Button type="submit">Submit</Button>
              <Button type="button" onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {submitted && (
        <Card className="w-full max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(formData).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium">Total Amount</TableCell>
                  <TableCell>${totalAmount}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FormField({ label, name, type = "text", value, onChange, error }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}