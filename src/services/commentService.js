// Add these methods to your existing blogService or create a new commentService

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const commentService = {
  // Add a comment to a blog post
  async addComment(blogId, commenter, commentText, token) {
    try {
      console.log("Service: Adding comment to blog:", blogId);

      const response = await fetch(`${API_BASE_URL}/comments/blog/${blogId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          commenter: commenter.trim(),
          commentText: commentText.trim(),
        }),
      });

      const data = await response.json();
      console.log("Service: Add comment response:", data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to add comment",
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      console.error("Service: Add comment error:", error);
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },

  // Get comments for a blog post
  async getCommentsByBlogId(blogId, options = {}) {
    try {
      console.log(
        "Service: Fetching comments for blog:",
        blogId,
        "with options:",
        options
      );

      const queryParams = new URLSearchParams();

      // Add query parameters
      if (options.page) queryParams.append("page", options.page);
      if (options.limit) queryParams.append("limit", options.limit);
      if (options.sortOrder) queryParams.append("sortOrder", options.sortOrder);

      const url = `${API_BASE_URL}/comments/blog/${blogId}?${queryParams.toString()}`;
      console.log("Service: Fetching from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Service: Get comments response:", data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch comments",
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      console.error("Service: Get comments error:", error);
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },

  // Get a single comment by ID
  async getComment(commentId) {
    try {
      console.log("Service: Fetching comment:", commentId);

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Service: Get comment response:", data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch comment",
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      console.error("Service: Get comment error:", error);
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },

  // Update a comment
  async updateComment(commentId, commentText, token) {
    try {
      console.log("Service: Updating comment:", commentId);

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          commentText: commentText.trim(),
        }),
      });

      const data = await response.json();
      console.log("Service: Update comment response:", data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update comment",
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      console.error("Service: Update comment error:", error);
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },

  // Delete a comment
  async deleteComment(commentId, token) {
    try {
      console.log("Service: Deleting comment:", commentId);

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      console.log("Service: Delete comment response:", data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to delete comment",
        };
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error("Service: Delete comment error:", error);
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },
};

export default commentService;
