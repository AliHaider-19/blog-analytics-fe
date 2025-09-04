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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";
import { PlusCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AddPost() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const { isAuthenticated, token } = useAuthStore();
  const { addPost, isLoading } = usePostStore();
  const { setSelectedPage } = useNavigationStore();

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to create posts.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setSelectedPage("login")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and content");
      return;
    }

    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters long");
      return;
    }

    if (content.trim().length < 20) {
      setError("Content must be at least 20 characters long");
      return;
    }

    try {
      const result = await addPost(
        title.trim(),
        content.trim(),
        author.trim(),
        token
      );

      if (result.success) {
        // Show success toast
        toast.success(result.message || "Post created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Clear form
        setTitle("");
        setContent("");

        setSelectedPage("posts");
      } else {
        // Handle API errors
        console.error("Component: Failed to create post:", result.message);
        toast.error(
          result.message || "Failed to create post. Please try again.",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        setError(result.message || "Failed to create post. Please try again.");
      }
    } catch (err) {
      console.error("Component: Error creating post:", err);
      const errorMessage =
        "Network error. Please check your connection and try again.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedPage("posts")}
          className="mb-4"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>
        <h1 className="text-3xl font-bold text-balance">Create New Post</h1>
        <p className="text-muted-foreground mt-2">
          Share your thoughts and ideas with the community.
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="author">Post Author</Label>
              <Input
                id="author"
                type="text"
                placeholder="Enter your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter an engaging title for your post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here. Share your insights, experiences, or knowledge..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
                rows={12}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters • {content.length} characters written
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between pt-4">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedPage("posts")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !title.trim() || !content.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Post"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
