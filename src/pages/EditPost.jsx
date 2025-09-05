/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
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
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchPostById, updatePost } = usePostStore();

  // Load post data when component mounts
  useEffect(() => {
    const loadPost = async () => {
      if (id) {
        try {
          setIsLoadingPost(true);
          const result = await fetchPostById(id);
          if (result.success) {
            setPost(result.data);
            setFormData({
              title: result.data.title || "",
              content: result.data.content || "",
            });
          } else {
            toast.error("Failed to load post for editing");
            navigate("/posts");
          }
        } catch (error) {
          toast.error("Error loading post");
          navigate("/posts");
        } finally {
          setIsLoadingPost(false);
        }
      }
    };

    loadPost();
  }, [id, fetchPostById, navigate]);

  // Check authorization
  const isAuthorized = (() => {
    if (!user || !post) {
      console.log("No user or post for authorization check");
      return false;
    }

    const currentUserId = user.id || user._id;
    const postUserId = post.userId;
    const currentUsername = user.username;
    const postAuthor = post.author;

    // Check if current user is the author by comparing userId or username
    const userIdMatch =
      currentUserId && postUserId && currentUserId === postUserId;
    const usernameMatch =
      currentUsername && postAuthor && currentUsername === postAuthor;

    return userIdMatch || usernameMatch;
  })();

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

    if (!post) {
      toast.error("Post not found");
      return;
    }

    if (!isAuthorized) {
      toast.error("You are not authorized to edit this post");
      navigate("/posts");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // const token = getToken();
    const { token } = useAuthStore.getState((state) => state);
    if (!token) {
      toast.error("Please log in to edit posts");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updateData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
      };

      const result = await updatePost(id, updateData, token);

      if (result.success) {
        toast.success("Post updated successfully!");
        navigate(`/posts/${id}`);
      } else {
        toast.error(result.message || "Failed to update post");
      }
    } catch (error) {
      toast.error("Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/posts/${id}`);
  };

  // Loading state
  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  // Not found or unauthorized
  if (!post || !isAuthorized) {
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
            <Button onClick={() => navigate("/posts")}>
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
