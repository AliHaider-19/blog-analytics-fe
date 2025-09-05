/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
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
  Heart,
  Share2,
  BookOpen,
  Sparkles,
  Send,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PostCard({ post }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { user, isAuthenticated, getToken } = useAuthStore();
  const { deletePost } = usePostStore();
  const navigate = useNavigate();
  const { addComment, deleteComment, isSubmitting } = useCommentStore();

  // Add safety check for post
  if (!post) {
    return null;
  }

  // Check if current user is the author of the post
  const isAuthor = (() => {
    if (!user || !post) {
      return false;
    }

    const currentUserId = user.id || user._id;
    const postUserId = post.userId;
    const currentUsername = user.username;
    const postAuthor = post.author;

    // Check if current user is the author by comparing userId or username
    const userIdMatch = currentUserId && postUserId && currentUserId === postUserId;
    const usernameMatch = currentUsername && postAuthor && currentUsername === postAuthor;

    return userIdMatch || usernameMatch;
  })();

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
    navigate(`/posts/${post._id}`);
  };

  const handleEdit = () => {
    navigate(`/edit-post/${post._id}`);
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
    // post.author should be a string (username) from the backend
    if (post.author && typeof post.author === "string" && post.author.trim() !== "") {
      return post.author;
    }
    // Fallback for object structure (if it exists)
    if (post.author?.username) return post.author.username;
    if (post.author?.name) return post.author.name;
    
    // If author field is empty/null, show "Unknown Author"
    return "Unknown Author";
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full"
      >
        <Card className="card-glass h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 relative group">
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1), rgba(16,185,129,0.1))",
                "linear-gradient(135deg, rgba(147,51,234,0.1), rgba(16,185,129,0.1), rgba(59,130,246,0.1))",
                "linear-gradient(225deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1), rgba(147,51,234,0.1))",
                "linear-gradient(315deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1), rgba(16,185,129,0.1))",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative z-10 h-full flex flex-col">
            <CardHeader className="flex-grow pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 break-words bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text hover:from-primary hover:to-purple-600 transition-colors duration-300 cursor-pointer" onClick={handleViewPost}>
                      {post.title}
                    </CardTitle>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardDescription className="text-sm text-muted-foreground mb-3 break-words leading-relaxed">
                      {truncateContent(post.content)}
                    </CardDescription>
                  </motion.div>
                </div>

                {/* Actions dropdown for post author */}
                <AnimatePresence>
                  {isAuthor && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex-shrink-0"
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border border-border/50">
                          <DropdownMenuItem onClick={handleEdit} className="hover:bg-primary/10 hover:text-primary">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setShowDeleteDialog(true)}
                            className="text-destructive hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4 overflow-hidden">
              {/* Post metadata */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-2"
              >
                <div className="flex items-center space-x-4 flex-wrap gap-x-4 gap-y-1">
                  <motion.div 
                    className="flex items-center space-x-1 min-w-0"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative">
                      <User className="h-3 w-3 flex-shrink-0 text-primary" />
                      <motion.div
                        className="absolute -inset-1 bg-primary/20 rounded-full -z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                      />
                    </div>
                    <span className="truncate font-medium">{getAuthorName()}</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-1 flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Calendar className="h-3 w-3 text-emerald-600" />
                    <span>{formatDate(post.createdAt)}</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-1 flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                  >
                    <MessageCircle className="h-3 w-3 text-purple-600" />
                    <span>
                      {commentCount} comment{commentCount !== 1 ? "s" : ""}
                    </span>
                  </motion.div>
                </div>

                {post.category && (
                  <motion.span 
                    className="bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs flex-shrink-0 font-medium"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(59,130,246,0.1)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {post.category}
                  </motion.span>
                )}
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-2"
              >
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewPost}
                    className="w-full bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 text-primary hover:from-primary/10 hover:to-purple-500/10 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <BookOpen className="h-4 w-4 mr-2 group-hover:text-primary" />
                    Read More
                    <motion.div
                      className="ml-auto opacity-0 group-hover:opacity-100"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="h-3 w-3" />
                    </motion.div>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center space-x-2 flex-shrink-0 transition-all duration-300 ${
                      showComments 
                        ? "bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30 text-emerald-700" 
                        : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 hover:from-emerald-500/10 hover:to-blue-500/10 hover:border-emerald-500/20"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{showComments ? "Hide" : "Show"}</span>
                  </Button>
                </motion.div>
              </motion.div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-4 border-t border-border/20 overflow-hidden"
              >
                {/* Existing Comments */}
                {comments.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto overflow-x-hidden">
                    {comments.map((comment, index) => (
                      <motion.div
                        key={comment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-slate-50/50 to-blue-50/30 p-3 rounded-lg overflow-hidden border border-border/10 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <div className="relative">
                              <User className="h-3 w-3 text-primary flex-shrink-0" />
                              <div className="absolute -inset-0.5 bg-primary/10 rounded-full -z-10" />
                            </div>
                            <span className="text-sm font-medium truncate text-foreground">
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
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="h-auto p-1 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 transition-colors"
                                  disabled={isSubmitting}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </motion.div>
                            )}
                        </div>
                        <p className="text-sm break-words whitespace-pre-wrap text-foreground/90 leading-relaxed">
                          {comment.commentText}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <MessageCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground italic">
                      No comments yet. Be the first to comment!
                    </p>
                  </motion.div>
                )}

                {/* Add Comment Section */}
                {isAuthenticated() ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3 p-4 bg-gradient-to-r from-emerald-50/30 to-blue-50/30 rounded-lg border border-emerald-200/20"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Join the conversation</span>
                    </div>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isSubmitting}
                        maxLength={500}
                        className="w-full bg-background/80 border-emerald-200/30 focus:border-emerald-500/50 transition-all duration-300"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(e);
                          }
                        }}
                      />
                    </motion.div>
                    <div className="flex items-center justify-between gap-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          onClick={handleAddComment}
                          size="sm"
                          disabled={isSubmitting || !newComment.trim()}
                          className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0"
                        >
                          {isSubmitting ? (
                            <motion.div
                              className="flex items-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Adding...
                            </motion.div>
                          ) : (
                            <motion.div className="flex items-center">
                              <Send className="h-4 w-4 mr-2" />
                              Add Comment
                            </motion.div>
                          )}
                        </Button>
                      </motion.div>
                      <span className={`text-xs transition-colors flex-shrink-0 ${
                        newComment.length > 450 ? 'text-amber-600' : newComment.length > 400 ? 'text-yellow-600' : 'text-muted-foreground'
                      }`}>
                        {newComment.length}/500
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6 px-4 bg-gradient-to-r from-slate-50/50 to-blue-50/30 rounded-lg border border-border/10"
                >
                  <User className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground italic mb-3">
                    Please log in to join the conversation.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/login")}
                      className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 text-primary hover:from-primary/10 hover:to-purple-500/10 hover:border-primary/30 transition-all duration-300"
                    >
                      Sign In to Comment
                    </Button>
                  </motion.div>
                </motion.div>
              )}
              </motion.div>
            )}
          </AnimatePresence>
            </CardContent>
          </div>
        </Card>
      </motion.div>

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
