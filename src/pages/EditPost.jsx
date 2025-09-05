import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigationStore } from "../store/useNavigationStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function EditPost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuthStore();
  const { setSelectedPage, selectedPost, setSelectedPost } =
    useNavigationStore();

  // Load post data when component mounts
  useEffect(() => {
    console.log("EditPost mounted. SelectedPost:", selectedPost);
    if (selectedPost) {
      setFormData({
        title: selectedPost.title || "",
        content: selectedPost.content || "",
      });
    } else {
      setSelectedPage("posts");
    }
  }, [selectedPost, setSelectedPage]);

  // Check authorization
  const isAuthorized = (() => {
    if (!user || !selectedPost) {
      console.log("No user or selectedPost");
      return false;
    }

    const userId = user.id || user._id;
    const username = user.username;

    // Handle different author field formats
    const authorId = selectedPost.author?._id || selectedPost.author?.id;
    const authorUsername = selectedPost.author?.username || selectedPost.author;

    // Check both ID and username matching
    const idMatch = authorId && userId && userId === authorId;
    const usernameMatch =
      authorUsername && username && username === authorUsername;

    console.log("ID Match:", idMatch, "Username Match:", usernameMatch);

    return idMatch || usernameMatch;
  })();
  const { token } = useAuthStore((state) => state);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general error
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPost) {
      console.log("No selected post");
      toast.error("No post selected for editing");
      return;
    }

    if (!isAuthorized) {
      console.log("Not authorized");
      toast.error("You are not authorized to edit this post");
      setSelectedPage("posts");
      return;
    }

    if (!validateForm()) {
      console.log("Form validation failed");
      toast.error("Please fix the errors in the form");
      return;
    }

    console.log("Token exists:", !!token);

    if (!token) {
      console.log("No token");
      toast.error("Please log in to edit posts");
      setSelectedPage("login");
      return;
    }

    setIsLoading(true);
    setError(null);

    console.log("About to call updatePost with Axios...");

    try {
      const updateData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
      };

      console.log("Making PUT request with:", updateData);

      const response = await axios.put(
        `http://localhost:5000/api/blogs/${selectedPost._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Axios response:", response.data);

      if (response.data.success || response.status === 200) {
        toast.success("Post updated successfully!");
        setSelectedPost(null);
        setSelectedPage("posts");
      } else {
        throw new Error(response.data.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);

      let errorMessage = "Failed to update post. Please try again.";

      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        console.log("Error response:", { status, data });

        if (status === 401) {
          errorMessage = "You are not authorized to edit this post";
          setSelectedPage("login");
        } else if (status === 403) {
          errorMessage = "Access denied. You can only edit your own posts";
          setSelectedPage("posts");
        } else if (status === 404) {
          errorMessage = "Post not found";
          setSelectedPage("posts");
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        }
      } else if (error.request) {
        // Network error
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }

    console.log("=== SUBMIT ENDED ===");
  };

  const handleCancel = () => {
    setSelectedPost(null);
    setSelectedPage("posts");
  };

  if (!selectedPost) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Post Selected</CardTitle>
            <CardDescription>Please select a post to edit.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setSelectedPage("posts")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to edit this post.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setSelectedPage("posts")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground mt-2">
            Update your blog post and share your thoughts with the community.
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>Update your blog post.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter a title for your post"
                value={formData.title}
                onChange={handleInputChange}
                className={formErrors.title ? "border-destructive" : ""}
                disabled={isLoading}
                required
              />
              {formErrors.title && (
                <p className="text-sm text-destructive">{formErrors.title}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog post content here..."
                value={formData.content}
                onChange={handleInputChange}
                className={`min-h-[300px] resize-y ${
                  formErrors.content ? "border-destructive" : ""
                }`}
                disabled={isLoading}
                required
              />
              {formErrors.content && (
                <p className="text-sm text-destructive">{formErrors.content}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
