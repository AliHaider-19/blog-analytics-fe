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
import { PlusCircle, ArrowLeft } from "lucide-react";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { user, isAuthenticated } = useAuthStore();
  const { addPost } = usePostStore();
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

    setIsSubmitting(true);

    try {
      addPost(title.trim(), content.trim(), user.username);
      setTitle("");
      setContent("");
      setSelectedPage("posts");
    } catch (err) {
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedPage("posts")}
          className="mb-4"
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
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlusCircle className="h-5 w-5" />
            <span>New Blog Post</span>
          </CardTitle>
          <CardDescription>
            Fill in the details below to create your new post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter an engaging title for your post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 5 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here. Share your insights, experiences, or knowledge..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                rows={12}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters • {content.length} characters written
              </p>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Publishing as:{" "}
                <span className="font-medium">{user?.username}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedPage("posts")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                >
                  {isSubmitting ? "Publishing..." : "Publish Post"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
