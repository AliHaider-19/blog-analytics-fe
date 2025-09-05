/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  Clock,
  BookOpen,
  Eye,
  Share2,
  Heart,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ViewPost() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore((state) => state);
  const { deletePost, fetchPostById } = usePostStore();

  useEffect(() => {
    const loadPost = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const result = await fetchPostById(id);
          if (result.success) {
            setPost(result.data);
          } else {
            toast.error("Failed to load post");
          }
        } catch (error) {
          toast.error("Error loading post");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPost();
  }, [id, fetchPostById]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePost(post._id, token);

      toast.success(result.message || "Post deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/posts");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete post. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => {
    navigate("/posts");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="relative inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
            <motion.div
              className="absolute -inset-2 bg-primary/20 rounded-full -z-10"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <motion.p 
            className="text-muted-foreground font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading your post...
          </motion.p>
          <motion.div
            className="mt-4 flex justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary/60 rounded-full"
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // If no post is found, show error state
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="card-glass w-full max-w-md text-center py-8">
            <CardHeader>
              <motion.div
                className="mx-auto mb-4"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <BookOpen className="h-16 w-16 text-muted-foreground/50" />
              </motion.div>
              <CardTitle className="text-2xl mb-2">Post Not Found</CardTitle>
              <CardDescription className="text-lg">
                The post you're looking for could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleBack}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Posts
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Actions */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </motion.div>

          {/* Actions dropdown for post author */}
          <AnimatePresence>
            {isAuthor && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 text-primary hover:from-primary/10 hover:to-purple-500/10 hover:border-primary/30 transition-all duration-300"
                      >
                        <MoreVertical className="h-4 w-4 mr-2" />
                        Actions
                        <motion.div
                          animate={{ rotate: [0, 180, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Sparkles className="h-3 w-3 ml-2" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="card-glass">
                    <DropdownMenuItem onClick={handleEdit} className="hover:bg-primary/10">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Post Content */}
        <motion.article 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Post Header */}
          <div className="space-y-6">
            <motion.h1 
              className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {post.title}
            </motion.h1>

            {/* Post Metadata */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-gradient-to-r from-slate-50/50 to-blue-50/30 border border-border/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <User className="h-5 w-5 text-primary" />
                  <div className="absolute -inset-1 bg-primary/20 rounded-full -z-10" />
                </div>
                <span className="font-semibold text-foreground">
                  {(post.author && typeof post.author === "string" && post.author.trim() !== "") ? post.author : 
                   (post.author?.username || post.author?.name || "Unknown Author")}
                </span>
              </motion.div>

              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">Published {formatDate(post.createdAt)}</span>
              </motion.div>

              {post.updatedAt &&
                post.updatedAt !== post.createdAt && (
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">
                      Updated {formatDateTime(post.updatedAt)}
                    </span>
                  </motion.div>
                )}

              {post.category && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Badge className="bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border-primary/20 font-medium">
                    {post.category}
                  </Badge>
                </motion.div>
              )}

              {!post.isPublished && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Badge
                    variant="outline"
                    className="text-yellow-700 border-yellow-400 bg-yellow-50"
                  >
                    Draft
                  </Badge>
                </motion.div>
              )}

              <motion.div 
                className="flex items-center space-x-2 text-muted-foreground ml-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm">Reading time: {Math.ceil(post.content.length / 200)} min</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="card-glass overflow-hidden">
              <CardContent className="p-8">
                <motion.div 
                  className="prose prose-lg prose-gray dark:prose-invert max-w-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
                    {post.content}
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Post Footer */}
          <motion.div 
            className="flex items-center justify-between pt-8 border-t border-border/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-2 h-2 rounded-full ${post.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="font-medium">{post.isPublished ? "Published" : "Draft"}</span>
              </motion.div>
              <span>•</span>
              <span>{post.content.length} characters</span>
            </div>

            <AnimatePresence>
              {isAuthor && (
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEdit}
                      className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 text-primary hover:from-primary/10 hover:to-purple-500/10"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.article>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{post.title}"? This
              action cannot be undone.
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
