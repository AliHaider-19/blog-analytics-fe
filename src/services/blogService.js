import axios from "axios";

// 1. CREATE: services/blogService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const blogService = {
  // Create a new blog post
  async createBlog(title, content, author, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          author,
          category: "General", // Default category
          isPublished: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create blog post",
        };
      }

      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },

  // Get all blog posts
  // In your blogService file
  async getAllBlogs(options = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add parameters
      if (options.page) queryParams.append("page", options.page);
      if (options.limit) queryParams.append("limit", options.limit);
      if (options.sortBy) queryParams.append("sortBy", options.sortBy);
      if (options.sortOrder) queryParams.append("sortOrder", options.sortOrder);
      if (options.search) queryParams.append("search", options.search);
      if (options.category) queryParams.append("category", options.category);
      if (options.author) queryParams.append("author", options.author);

      const response = await fetch(
        `${API_BASE_URL}/blogs?${queryParams.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch blogs",
        };
      }

      return {
        success: true,
        data: data.data, // This should contain { blogs: [], pagination: {} }
      };
    } catch (error) {
      console.error("Service: Error fetching blogs:", error);
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },

  // Get a single blog post
  async getBlogById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch blog post",
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },

  // Update a blog post
  async updateBlog(id, updateData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update blog post",
        };
      }

      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },

  // Delete a blog post
  async deleteBlog(id, token) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message: response.data.message || "Failed to delete blog post",
        };
      }

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },
};

export default blogService;
