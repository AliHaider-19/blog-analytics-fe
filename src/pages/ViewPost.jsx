/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { useNavigationStore } from "../store/useNavigationStore";
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
} from "lucide-react";
import { toast } from "react-toastify";

export default function ViewPost() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user, token: getToken } = useAuthStore((state) => state);
  const { deletePost } = usePostStore();
  const { selectedPost, setSelectedPage, setSelectedPost } =
    useNavigationStore();

  // Check if current user is the author of the post - improved logic
  const isAuthor =
    user &&
    selectedPost &&
    // Handle different author object structures
    (user.id === selectedPost.author._id ||
      user._id === selectedPost.author._id ||
      user.id === selectedPost.author ||
      user._id === selectedPost.author ||
      (typeof selectedPost.author === "string" &&
        (user.id === selectedPost.author ||
          user._id === selectedPost.author)) ||
      (typeof selectedPost.author === "object" &&
        selectedPost.author &&
        (user.id === selectedPost.author.id ||
          user._id === selectedPost.author.id ||
          user.username === selectedPost.author.username ||
          user.username === selectedPost.author)));

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
    setSelectedPage("edit-post");
  };
  const { token } = useAuthStore((state) => state);
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePost(selectedPost._id, token);

      toast.success(result.message || "Post deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setSelectedPost(null);
      setSelectedPage("posts");
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
    setSelectedPost(null);
    setSelectedPage("posts");
  };

  // If no post is selected, show error state
  if (!selectedPost) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Post Not Found</CardTitle>
            <CardDescription>
              The post you're looking for could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>

          {/* Actions dropdown for post author */}
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Actions
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
          )}
        </div>

        {/* Post Content */}
        <article className="space-y-6">
          {/* Post Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance leading-tight">
              {selectedPost.title}
            </h1>

            {/* Post Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="font-medium">
                  {selectedPost.author?.username ||
                    selectedPost.author?.name ||
                    "Anonymous"}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Published {formatDate(selectedPost.createdAt)}</span>
              </div>

              {selectedPost.updatedAt &&
                selectedPost.updatedAt !== selectedPost.createdAt && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      Updated {formatDateTime(selectedPost.updatedAt)}
                    </span>
                  </div>
                )}

              {selectedPost.category && (
                <Badge variant="secondary">{selectedPost.category}</Badge>
              )}

              {!selectedPost.isPublished && (
                <Badge
                  variant="outline"
                  className="text-yellow-600 border-yellow-600"
                >
                  Draft
                </Badge>
              )}
            </div>
          </div>

          {/* Post Content */}
          <Card>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none pt-6">
              <div className="whitespace-pre-wrap text-base leading-relaxed">
                {selectedPost.content}
              </div>
            </CardContent>
          </Card>

          {/* Post Footer */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedPost.isPublished ? "Published" : "Draft"} •{" "}
              {selectedPost.content.length} characters
            </div>

            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </article>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedPost.title}"? This
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
