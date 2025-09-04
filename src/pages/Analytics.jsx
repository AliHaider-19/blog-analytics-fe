import { usePostStore } from "../store/usePostStore";
import { useAnalyticsStore } from "../store/useAnalyticsStore";
import AnalyticsChart from "../components/AnalyticsChart";
import AuthorTable from "../components/AuthorTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  BarChart3,
  Users,
  MessageCircle,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function Analytics() {
  const { posts } = usePostStore();
  const { getTopAuthors, getMostCommentedPosts, getPostsPerDay } =
    useAnalyticsStore();

  const topAuthors = getTopAuthors(posts);
  const mostCommentedPosts = getMostCommentedPosts(posts);
  const postsPerDay = getPostsPerDay(posts);

  const totalPosts = posts.length;
  const totalComments = posts.reduce(
    (total, post) => total + post.comments.length,
    0
  );
  const totalAuthors = new Set(posts.map((post) => post.author)).size;
  const avgCommentsPerPost =
    totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance flex items-center space-x-2">
          <BarChart3 className="h-8 w-8" />
          <span>Analytics Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Insights and metrics about your blog community and content
          performance.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Authors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAuthors}</div>
            <p className="text-xs text-muted-foreground">
              Contributing writers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Comments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCommentsPerPost}</div>
            <p className="text-xs text-muted-foreground">Per post</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts Per Day Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Posts Created (Last 7 Days)</CardTitle>
            <CardDescription>
              Daily posting activity over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={postsPerDay} />
          </CardContent>
        </Card>

        {/* Top Authors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Authors</CardTitle>
            <CardDescription>
              Authors ranked by number of posts published
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthorTable authors={topAuthors} />
          </CardContent>
        </Card>
      </div>

      {/* Most Commented Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Most Commented Posts</CardTitle>
          <CardDescription>
            Top 5 posts with the highest engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mostCommentedPosts.length > 0 ? (
            <div className="space-y-4">
              {mostCommentedPosts.map((post, index) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <h3 className="font-medium text-balance">{post.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By {post.author} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{post.commentCount}</span>
                    <span className="text-muted-foreground">comments</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No posts with comments yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
