import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const ContactForm = ({ addContact, closeDialog }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && phone && email) {
      addContact({ name, phone, email });
      setName("");
      setPhone("");
      setEmail("");
      closeDialog();
    }
  };

  const handleClear = () => {
    setName("");
    setPhone("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          pattern="[0-9]{10}"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-between">
        <Button type="submit">Submit</Button>
        <Button type="button" onClick={handleClear} variant="outline">
          Clear All
        </Button>
      </div>
    </form>
  );
};

const ContactCard = ({ contact, onDelete }) => (
  <Card className="mb-4">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{contact.name}</CardTitle>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(contact)}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent>
      <p className="text-xs text-muted-foreground">Phone: {contact.phone}</p>
      <p className="text-xs text-muted-foreground">Email: {contact.email}</p>
    </CardContent>
  </Card>
);

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    setContacts(storedContacts);
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const deleteContact = (contactToDelete) => {
    setContacts((prevContacts) => prevContacts.filter((contact) => contact !== contactToDelete));
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Contact Organizer App</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mb-4">Add Contact</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm addContact={addContact} closeDialog={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      <Input
        type="text"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div>
        {filteredContacts.map((contact, index) => (
          <ContactCard key={index} contact={contact} onDelete={deleteContact} />
        ))}
      </div>
    </div>
  );
}