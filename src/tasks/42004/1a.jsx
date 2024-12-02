import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MovieCard = ({ movie, onDelete, onStatusChange }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{movie.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Genre: {movie.genre}</p>
      <p>Director: {movie.director}</p>
      <p>Release Year: {movie.releaseYear}</p>
      <p>Rating: {movie.rating}/10</p>
      <RadioGroup
        defaultValue={movie.status}
        onValueChange={(value) => onStatusChange(movie.id, value)}
        className="flex space-x-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="to-watch" id={`to-watch-${movie.id}`} />
          <Label htmlFor={`to-watch-${movie.id}`}>To Watch</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="watched" id={`watched-${movie.id}`} />
          <Label htmlFor={`watched-${movie.id}`}>Watched</Label>
        </div>
      </RadioGroup>
      <Button onClick={() => onDelete(movie.id)} className="mt-2">Delete</Button>
    </CardContent>
  </Card>
);

const AddMovieForm = ({ onSubmit, onCancel }) => {
  const [movie, setMovie] = useState({ title: "", genre: "", director: "", releaseYear: "", rating: 5 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movie.title && movie.genre && movie.releaseYear) {
      onSubmit({ ...movie, id: Date.now(), status: "to-watch" });
      setMovie({ title: "", genre: "", director: "", releaseYear: "", rating: 5 });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={movie.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="genre">Genre</Label>
        <Input id="genre" name="genre" value={movie.genre} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="director">Director</Label>
        <Input id="director" name="director" value={movie.director} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="releaseYear">Release Year</Label>
        <Input id="releaseYear" name="releaseYear" type="number" value={movie.releaseYear} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Slider
          id="rating"
          name="rating"
          min={1}
          max={10}
          step={1}
          value={[movie.rating]}
          onValueChange={(value) => setMovie((prev) => ({ ...prev, rating: value[0] }))}
        />
        <span>{movie.rating}/10</span>
      </div>
      <Button type="submit">Add Movie</Button>
      <Button type="button" onClick={onCancel} variant="outline">Cancel</Button>
    </form>
  );
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    const storedMovies = localStorage.getItem("movies");
    if (storedMovies) {
      setMovies(JSON.parse(storedMovies));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  const addMovie = (movie) => {
    setMovies((prev) => [...prev, movie]);
    setShowAddForm(false);
  };

  const deleteMovie = (id) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  };

  const resetWatchlist = () => {
    setMovies([]);
  };

  const changeStatus = (id, status) => {
    setMovies((prev) =>
      prev.map((movie) => (movie.id === id ? { ...movie, status } : movie))
    );
  };

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "releaseYear") return b.releaseYear - a.releaseYear;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Movie Watch List</h1>
      {!showAddForm && (
        <>
          <div className="flex justify-between mb-4">
            <Button onClick={() => setShowAddForm(true)}>Add Movie</Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="releaseYear">Release Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {sortedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDelete={deleteMovie}
              onStatusChange={changeStatus}
            />
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Reset Watchlist</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to reset the watchlist?</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={resetWatchlist} variant="destructive">Reset</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
      {showAddForm && (
        <AddMovieForm
          onSubmit={addMovie}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}