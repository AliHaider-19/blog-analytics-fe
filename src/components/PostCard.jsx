/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { useNavigationStore } from "../store/useNavigationStore";
import { useCommentStore } from "../store/userCommentStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Calendar,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  MessageCircle,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PostCard({ post }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { user, isAuthenticated, getToken } = useAuthStore();
  const { deletePost } = usePostStore();
  const { setSelectedPage, setSelectedPost } = useNavigationStore();
  const { addComment, deleteComment, isSubmitting } = useCommentStore();

  // Add safety check for post
  if (!post) {
    return null;
  }

  // Check if current user is the author of the post - improved logic
  const isAuthor =
    user &&
    post.author &&
    // Handle different author object structures
    (user.id === post.author._id ||
      user._id === post.author._id ||
      user.id === post.author ||
      user._id === post.author ||
      (typeof post.author === "string" &&
        (user.id === post.author || user._id === post.author)) ||
      (typeof post.author === "object" &&
        post.author &&
        (user.id === post.author.id ||
          user._id === post.author.id ||
          user.username === post.author.username ||
          user.username === post.author)));

  // Use comments directly from the post object (now included from backend)
  const comments = post.comments || [];
  const commentCount = post.commentCount || comments.length || 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewPost = () => {
    setSelectedPost(post);
    setSelectedPage("view-post");
  };

  const handleEdit = () => {
    setSelectedPost(post);
    setSelectedPage("edit-post");
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const token = getToken();
      const result = await deletePost(post._id, token);

      if (result.success) {
        toast.success(result.message || "Post deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowDeleteDialog(false);
      } else {
        toast.error(result.message || "Failed to delete post", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.error("Failed to delete post. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
    const token = getToken();

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
        // You might want to refresh the posts or update local state here
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

    const token = getToken();
    const result = await deleteComment(commentId, post._id, token);

    if (result.success) {
      toast.success("Comment deleted successfully!");
      // Optionally trigger a refresh to update the comments display
    } else {
      toast.error(result.message || "Failed to delete comment");
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + "...";
  };

  // Get author name from different possible structures
  const getAuthorName = () => {
    if (typeof post.author === "string") return post.author;
    if (post.author?.username) return post.author.username;
    if (post.author?.name) return post.author.name;
    return "Anonymous";
  };

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="flex-grow">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 break-words">
                {post.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-3 break-words">
                {truncateContent(post.content)}
              </CardDescription>
            </div>

            {/* Actions dropdown for post author */}
            {isAuthor && (
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4 overflow-hidden">
          {/* Post metadata */}
          <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-2">
            <div className="flex items-center space-x-4 flex-wrap gap-x-4 gap-y-1">
              <div className="flex items-center space-x-1 min-w-0">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{getAuthorName()}</span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <MessageCircle className="h-3 w-3" />
                <span>
                  {commentCount} comment{commentCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {post.category && (
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs flex-shrink-0">
                {post.category}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewPost}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Read More
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 flex-shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{showComments ? "Hide" : "Show"}</span>
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="space-y-4 pt-4 border-t overflow-hidden">
              {/* Existing Comments */}
              {comments.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto overflow-x-hidden">
                  {comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-muted p-3 rounded-md overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {comment.commenter}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        {/* Show delete button if user owns the comment */}
                        {user &&
                          (comment.userId === user.id ||
                            comment.commenter === user.username) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment._id)}
                              className="h-auto p-1 text-red-600 hover:text-red-800 flex-shrink-0"
                              disabled={isSubmitting}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                      </div>
                      <p className="text-sm break-words whitespace-pre-wrap">
                        {comment.commentText}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No comments yet. Be the first to comment!
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
                    className="w-full"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(e);
                      }
                    }}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      onClick={handleAddComment}
                      size="sm"
                      disabled={isSubmitting || !newComment.trim()}
                      className="flex-shrink-0"
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
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {newComment.length}/500
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground italic mb-2">
                    Please log in to add comments.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPage("login")}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{post.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Post"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
