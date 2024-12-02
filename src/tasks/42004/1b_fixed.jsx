import React, { useState, useEffect } from 'react';
// import { 
//   Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
//   Button, Input, Label, Slider, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
//   RadioGroup, RadioGroupItem
// } from "@/components/ui";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Check, Trash2, Plus, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { key: 'title', label: 'Title' },
  { key: 'rating', label: 'Rating' },
  { key: 'year', label: 'Release Year' }
];

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ status: 'to-watch' });
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    setMovies(savedMovies);
  }, []);

  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  const handleAddMovie = () => {
    if (newMovie.title && newMovie.genre && newMovie.year && newMovie.rating) {
      setMovies([...movies, { ...newMovie, id: Date.now() }]);
      setIsAddMovieOpen(false);
      setNewMovie({ status: 'to-watch' });
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleSort = (key) => {
    setSortBy(key);
    setMovies([...movies].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    }));
  };

  const handleDelete = () => {
    setMovies(movies.filter(movie => movie.id !== movieToDelete));
    setIsConfirmDeleteOpen(false);
  };

  const resetList = () => {
    if (window.confirm('Are you sure you want to reset the list?')) {
      setMovies([]);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Movie Watch List</h1>
      <Button onClick={() => setIsAddMovieOpen(true)} className="mb-4">Add Movie</Button>
      <Button onClick={resetList} className="mb-4 ml-2 bg-red-500 hover:bg-red-600">Reset List</Button>
      <div className="flex mb-4">
        {SORT_OPTIONS.map(option => (
          <Button 
            key={option.key} 
            onClick={() => handleSort(option.key)}
            variant={sortBy === option.key ? 'default' : 'outline'}
            className="ml-2"
          >
            Sort by {option.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {movies.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onDelete={() => { setMovieToDelete(movie.id); setIsConfirmDeleteOpen(true); }}
            onDetails={() => alert('Details functionality not implemented in this example.')}
          />
        ))}
      </div>

      {/* Add Movie Dialog */}
      <Dialog open={isAddMovieOpen} onOpenChange={setIsAddMovieOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Movie</DialogTitle>
          </DialogHeader>
          <Card>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleAddMovie(); }}>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" required value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} />
                  <Label htmlFor="genre">Genre</Label>
                  <Input id="genre" required value={newMovie.genre} onChange={e => setNewMovie({...newMovie, genre: e.target.value})} />
                  <Label htmlFor="director">Director</Label>
                  <Input id="director" value={newMovie.director} onChange={e => setNewMovie({...newMovie, director: e.target.value})} />
                  <Label htmlFor="year">Release Year</Label>
                  <Input id="year" type="number" required value={newMovie.year} onChange={e => setNewMovie({...newMovie, year: parseInt(e.target.value)})} />
                  <Label htmlFor="rating">Rating</Label>
                  <Slider defaultValue={[5]} max={10} step={1} value={newMovie.rating} onValueChange={value => setNewMovie({...newMovie, rating: value[0]})} />
                  <RadioGroup value={newMovie.status} onValueChange={status => setNewMovie({...newMovie, status})}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="watched" id="watched" />
                      <Label htmlFor="watched">Watched</Label>
                      <RadioGroupItem value="to-watch" id="to-watch" />
                      <Label htmlFor="to-watch">To Watch</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="mt-4">Submit</Button>
                <Button type="button" onClick={() => setIsAddMovieOpen(false)} className="mt-4 ml-2">Cancel</Button>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDelete}>Confirm</Button>
            <Button onClick={() => setIsConfirmDeleteOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MovieCard({ movie, onDelete, onDetails }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>{movie.genre}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Director: {movie.director}</p>
        <p>Year: {movie.year}</p>
        <p>Rating: {movie.rating}/10</p>
        <p>Status: {movie.status === 'watched' ? <Check className="inline" /> : 'To Watch'}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onDetails}>Details</Button>
        <Button variant="destructive" onClick={onDelete}><Trash2 /></Button>
      </CardFooter>
    </Card>
  );
}

export default App;