/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
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
  Sparkles,
  TrendingUp,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PostsList() {
  const { posts, isLoading, error, pagination, fetchPosts, clearError } =
    usePostStore();

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

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
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary" />
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full -z-10"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <motion.p 
            className="text-muted-foreground font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading amazing posts...
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

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Blog Posts
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Discover insights and stories from our community of writers.
          </motion.p>
        </div>
        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin text-primary" : "text-slate-600"}`}
              />
              Refresh
            </Button>
          </motion.div>
          {isAuthenticated() && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/add-post")}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>New Post</span>
                <motion.div
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-3 w-3 ml-1" />
                </motion.div>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="bg-red-50/80 border-red-200/80 backdrop-blur-sm">
              <AlertDescription className="flex items-center justify-between">
                <span className="text-red-800">{error}</span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="ml-2 border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                </motion.div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="card-glass relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="relative z-10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total Posts</CardTitle>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FileText className="h-5 w-5 text-blue-600" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-3xl font-bold text-blue-700"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {pagination.totalBlogs || posts.length}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Published articles</p>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="card-glass relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="relative z-10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total Comments</CardTitle>
                <motion.div
                  whileHover={{ rotate: -15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-3xl font-bold text-purple-700"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  {totalComments}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Community engagement</p>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="card-glass relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="relative z-10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Community</CardTitle>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="h-5 w-5 text-emerald-600" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-3xl font-bold text-emerald-700"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {posts.length > 0 ? new Set(posts.map(p => p.author)).size : 0}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Active writers</p>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Posts List */}
      <AnimatePresence mode="wait">
        {posts.length > 0 ? (
          <motion.div 
            key="posts-list"
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Latest Posts
              </h2>
              <motion.div 
                className="flex items-center space-x-2 text-sm text-muted-foreground"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="h-4 w-4" />
                <span>{posts.length} articles</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {posts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.1 + (index * 0.1),
                      type: "spring",
                      stiffness: 100
                    }}
                    layout
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
            </motion.div>

            {/* Loading indicator for refresh */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-6"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Loader2 className="h-6 w-6 text-primary mx-auto" />
                  </motion.div>
                  <motion.p
                    className="text-muted-foreground mt-2 text-sm"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Refreshing posts...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : !isLoading ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="card-glass text-center py-12">
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
                  <FileText className="h-16 w-16 text-muted-foreground/50" />
                </motion.div>
                <CardTitle className="text-2xl mb-2">No Posts Yet</CardTitle>
                <CardDescription className="text-lg">
                  Be the first to share your thoughts with the community!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAuthenticated() ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => navigate("/add-post")}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 text-lg px-8 py-3"
                      size="lg"
                    >
                      <PlusCircle className="h-5 w-5" />
                      <span>Create Your First Post</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Sign in to start creating amazing posts.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={() => navigate("/login")}
                        size="lg"
                        className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Sign In to Get Started
                      </Button>
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
