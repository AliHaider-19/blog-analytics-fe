/* eslint-disable no-unused-vars */
import { create } from "zustand";
import blogService from "../services/blogService";

const usePostStore = create((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Fetch all posts
  fetchPosts: async (options = {}) => {
    set({ isLoading: true, error: null });

    try {
      const result = await blogService.getAllBlogs(options);
      if (result.success && result.data) {
        set({
          posts: result.data.blogs || [], // Make sure we have an array
          pagination: result.data.pagination || {},
          isLoading: false,
          error: null,
        });
        return { success: true, data: result.data };
      } else {
        set({
          posts: [], // Set empty array on error
          isLoading: false,
          error: result.message || "Failed to fetch posts",
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Store: Error fetching posts:", error);
      const errorMessage = "Failed to fetch posts. Please try again.";
      set({
        posts: [], // Set empty array on error
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  },
  // Create a new post
  addPost: async (title, content, author, token) => {
    set({ isLoading: true, error: null });

    try {
      const result = await blogService.createBlog(
        title,
        content,
        author,
        token
      );

      if (result.success) {
        const { posts } = get();
        set({
          posts: [result.data, ...posts],
          isLoading: false,
          error: null,
        });
        return { success: true, message: result.message, data: result.data };
      } else {
        set({
          isLoading: false,
          error: result.message,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = "Failed to create post. Please try again.";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Get a single post by ID
  getPostById: async (id) => {
    try {
      const result = await blogService.getBlogById(id);

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: "Failed to fetch post." };
    }
  },

  // Update a post
  updatePost: async (id, updateData, token) => {
    set({ isLoading: true, error: null });

    try {
      console.log("Store: Updating post:", id, updateData);
      const result = await blogService.updateBlog(id, updateData, token);

      if (result.success) {
        // Update the post in the posts array
        const { posts } = get();
        const updatedPosts = posts.map((post) =>
          post._id === id ? result.data : post
        );

        set({
          posts: updatedPosts,
          isLoading: false,
          error: null,
        });
        return { success: true, message: result.message, data: result.data };
      } else {
        set({
          isLoading: false,
          error: result.message,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Store: Error updating post:", error);
      const errorMessage = "Failed to update post. Please try again.";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Delete a post
  deletePost: async (id, token) => {
    set({ isLoading: true, error: null });

    try {
      console.log("Store: Deleting post:", id);
      const result = await blogService.deleteBlog(id, token);

      if (result.success) {
        // Remove the post from the posts array
        const { posts } = get();
        const updatedPosts = posts.filter((post) => post._id !== id);

        set({
          posts: updatedPosts,
          isLoading: false,
          error: null,
        });
        return { success: true, message: result.message };
      } else {
        set({
          isLoading: false,
          error: result.message,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Store: Error deleting post:", error);
      const errorMessage = "Failed to delete post. Please try again.";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Legacy method for backward compatibility - now calls the API
  // eslint-disable-next-line no-unused-vars
  addComment: async (postId, commenter, text) => {
    // This would need a separate comment API endpoint
    // For now, you might want to implement comments as a separate feature
    console.warn(
      "addComment: Comments feature needs separate API implementation"
    );
    return {
      success: false,
      message: "Comments feature not yet implemented with API",
    };
  },

  // Remove the initializeMockData method since we're using real API data
}));

export { usePostStore };
