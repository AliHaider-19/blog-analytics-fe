"use client";

import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { MessageCircle, User, Calendar } from "lucide-react";

export default function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const { addComment } = usePostStore();

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated()) return;

    setIsSubmitting(true);
    addComment(post._id, user.username, newComment.trim());
    setNewComment("");
    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-balance">{post.title}</CardTitle>
        <CardDescription className="flex items-center space-x-4 text-sm">
          <span className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(post.createdAt)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <MessageCircle className="h-3 w-3" />
            <span>{post.comments.length} comments</span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-pretty leading-relaxed">{post.content}</p>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>
              {showComments ? "Hide" : "Show"} Comments ({post.comments.length})
            </span>
          </Button>
        </div>

        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            {/* Existing Comments */}
            {post.comments.length > 0 ? (
              <div className="space-y-3">
                {post.comments.map((comment, index) => (
                  <div key={index} className="bg-muted p-3 rounded-md">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {comment.commenter}
                      </span>
                    </div>
                    <p className="text-sm text-pretty">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No comments yet.
              </p>
            )}

            {/* Add Comment Form */}
            {isAuthenticated() ? (
              <form onSubmit={handleAddComment} className="space-y-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? "Adding..." : "Add Comment"}
                </Button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Please log in to add comments.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
