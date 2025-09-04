/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigationStore } from "../store/useNavigationStore";
import PostCard from "../components/PostCard";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  PlusCircle,
  FileText,
  MessageCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PostsList() {
  const { posts, isLoading, error, pagination, fetchPosts, clearError } =
    usePostStore();

  const { isAuthenticated } = useAuthStore();
  const { setSelectedPage } = useNavigationStore();

  // Fetch posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const options = {
        page: 1,
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      console.log("Component: Loading posts with options:", options);
      const result = await fetchPosts(options);

      console.log("Component: fetchPosts result:", result);

      if (!result.success) {
        toast.error(result.message || "Failed to load posts", {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        console.log("Component: Posts loaded successfully:", result.data);
      }
    } catch (error) {
      console.error("Component: Error loading posts:", error);
      toast.error("Failed to load posts. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleRefresh = () => {
    clearError();
    loadPosts();
  };

  // Calculate total comments (if posts have comments)
  const totalComments = posts.reduce(
    (total, post) => total + (post.comments?.length || 0),
    0
  );

  // Show loading state on initial load
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Discover insights and stories from our community of writers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {isAuthenticated() && (
            <Button
              onClick={() => setSelectedPage("add-post")}
              className="flex items-center space-x-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Post</span>
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="ml-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagination.totalBlogs || posts.length}
            </div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comments
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground">
              Community engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
          </div>

          {/* Loading indicator for refresh */}
          {isLoading && (
            <div className="text-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            </div>
          )}
        </div>
      ) : !isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>No Posts Yet</CardTitle>
            <CardDescription>
              Be the first to share your thoughts with the community!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthenticated() ? (
              <Button
                onClick={() => setSelectedPage("add-post")}
                className="flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create Your First Post</span>
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Sign in to start creating posts.
                </p>
                <Button onClick={() => setSelectedPage("login")}>
                  Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
