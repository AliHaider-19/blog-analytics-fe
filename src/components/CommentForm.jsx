"use client";

import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function CommentForm({ postId, onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const { addComment } = usePostStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !isAuthenticated()) return;

    setIsSubmitting(true);
    addComment(postId, user.username, comment.trim());
    setComment("");
    setIsSubmitting(false);

    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="p-4 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">
          Please log in to add comments.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="comment">Add a comment</Label>
        <Input
          id="comment"
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting || !comment.trim()}
      >
        {isSubmitting ? "Adding Comment..." : "Add Comment"}
      </Button>
    </form>
  );
}
