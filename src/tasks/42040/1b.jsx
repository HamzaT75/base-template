import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

const FeedbackForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && rating && comment) {
      onSubmit({ name, email, rating, comment });
      handleReset();
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setRating(0);
    setComment("");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Feedback Form</CardTitle>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Rate Your Experience</Label>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <div>
            <Label htmlFor="comment">Suggestions or Comments</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const FeedbackGrid = ({ feedbacks, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      {feedbacks.map((feedback, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6">
            <p>
              <strong>Name:</strong> {feedback.name}
            </p>
            <p>
              <strong>Email:</strong> {feedback.email}
            </p>
            <p>
              <strong>Rating:</strong> {feedback.rating}
            </p>
            <p>
              <strong>Comment:</strong> {feedback.comment}
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onDelete(index)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function App() {
  const [feedbacks, setFeedbacks] = useState([]);

  const handleSubmit = (feedback) => {
    setFeedbacks([...feedbacks, feedback]);
  };

  const handleDelete = (index) => {
    setFeedbacks(feedbacks.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4">
      <FeedbackForm onSubmit={handleSubmit} />
      <FeedbackGrid feedbacks={feedbacks} onDelete={handleDelete} />
    </div>
  );
}