/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCommentStore } from "../store/userCommentStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { MessageCircle, User, Calendar, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { user, isAuthenticated, token } = useAuthStore();
  const { addComment, deleteComment, isSubmitting } = useCommentStore();

  // Add safety check for post
  if (!post) {
    return null;
  }

  // Use comments directly from the post object (now included from backend)
  const comments = post.comments || [];
  const commentCount = post.commentCount || comments.length || 0;

  // Enhanced handleAddComment
  const handleAddComment = async (e) => {
    e?.preventDefault();

    // Check authentication first
    if (!isAuthenticated()) {
      toast.error("Please log in to add comments");
      return;
    }

    // Check comment content
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // Check if already submitting
    if (isSubmitting) {
      return;
    }

    const commenterName = user?.username || user?.name || "Anonymous";

    try {
      const result = await addComment(
        post._id,
        commenterName,
        newComment.trim(),
        token
      );

      if (result.success) {
        setNewComment("");
        toast.success("Comment added successfully!");

        // Optionally refresh the page or update local state
        // Since comments are now included with posts, you might want to
        // trigger a refresh of the posts list to get updated comments
      } else {
        toast.error(result.message || "Failed to add comment");
      }
    } catch (error) {
      toast.error("An error occurred while adding comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    // Fixed: was post._d, should be post._id
    const result = await deleteComment(commentId, post._id, token);

    if (result.success) {
      toast.success("Comment deleted successfully!");
      // Optionally trigger a refresh to update the comments display
    } else {
      toast.error(result.message || "Failed to delete comment");
    }
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
            <span>
              {commentCount} comment{commentCount !== 1 ? "s" : ""}
            </span>
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
              {showComments ? "Hide" : "Show"} Comments ({commentCount})
            </span>
          </Button>
        </div>

        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            {/* Existing Comments */}
            {comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-muted p-3 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {comment.commenter}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>

                      {/* Show delete button if user owns the comment */}
                      {user &&
                        (comment.userId === user.id ||
                          comment.commenter === user.username) && (
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment._id)}
                              className="h-auto p-1 text-red-600 hover:text-red-800"
                              disabled={isSubmitting}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                    </div>
                    <p className="text-sm text-pretty">{comment.commentText}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No comments yet.
              </p>
            )}

            {/* Add Comment Section */}
            {isAuthenticated() ? (
              <div className="space-y-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isSubmitting}
                  maxLength={500}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(e);
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    onClick={handleAddComment}
                    size="sm"
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      "Add Comment"
                    )}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {newComment.length}/500
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground italic">
                  Please log in to add comments.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
