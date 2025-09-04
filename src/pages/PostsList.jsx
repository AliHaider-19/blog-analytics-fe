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
import { PlusCircle, FileText, MessageCircle } from "lucide-react";

export default function PostsList() {
  const { posts } = usePostStore();
  const { isAuthenticated } = useAuthStore();
  const { setSelectedPage } = useNavigationStore();

  const totalComments = posts.reduce(
    (total, post) => total + post.comments.length,
    0
  );

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
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
          <div className="space-y-4">
            {posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
