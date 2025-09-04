import { create } from "zustand";
import { devtools } from "zustand/middleware";
import commentService from "../services/commentService";

const useCommentStore = create(
  devtools(
    (set, get) => ({
      // State
      comments: {}, // Structure: { blogId: { comments: [], pagination: {}, isLoading: false, error: null } }
      isLoading: false,
      error: null,
      isSubmitting: false,

      // Actions

      // Add a comment to a blog post
      addComment: async (blogId, commenter, commentText, token) => {
        console.log("Store: addComment called with:", {
          blogId,
          commenter,
          commentText,
          hasToken: !!token,
        });

        set({ isSubmitting: true, error: null });

        try {
          console.log("Store: Calling commentService.addComment");
          const result = await commentService.addComment(
            blogId,
            commenter,
            commentText,
            token
          );

          console.log("Store: Service returned:", result);

          if (result.success) {
            // Update the comments for this blog
            set((state) => ({
              comments: {
                ...state.comments,
                [blogId]: {
                  ...state.comments[blogId],
                  comments: [
                    ...(state.comments[blogId]?.comments || []),
                    result.data,
                  ],
                  pagination: {
                    ...state.comments[blogId]?.pagination,
                    totalComments:
                      (state.comments[blogId]?.pagination?.totalComments || 0) +
                      1,
                  },
                },
              },
              isSubmitting: false,
              error: null,
            }));

            console.log("Store: Comment added successfully");
            return {
              success: true,
              message: result.message,
              data: result.data,
            };
          } else {
            console.log("Store: Service failed:", result.message);
            set({ isSubmitting: false, error: result.message });
            return {
              success: false,
              message: result.message,
              errors: result.errors,
            };
          }
        } catch (error) {
          console.error("Store: Error adding comment:", error);
          const errorMessage = "Failed to add comment. Please try again.";
          set({ isSubmitting: false, error: errorMessage });
          return {
            success: false,
            message: errorMessage,
          };
        }
      },

      // Fetch comments for a specific blog
      fetchComments: async (blogId, options = {}) => {
        // Set loading for this specific blog
        set((state) => ({
          comments: {
            ...state.comments,
            [blogId]: {
              ...state.comments[blogId],
              isLoading: true,
              error: null,
            },
          },
        }));

        try {
          const result = await commentService.getCommentsByBlogId(
            blogId,
            options
          );

          if (result.success) {
            set((state) => ({
              comments: {
                ...state.comments,
                [blogId]: {
                  comments: result.data.comments,
                  pagination: result.data.pagination,
                  isLoading: false,
                  error: null,
                },
              },
              error: null,
            }));

            return {
              success: true,
              data: result.data,
            };
          } else {
            set((state) => ({
              comments: {
                ...state.comments,
                [blogId]: {
                  ...state.comments[blogId],
                  isLoading: false,
                  error: result.message,
                },
              },
            }));

            return {
              success: false,
              message: result.message,
            };
          }
        } catch (error) {
          console.error("Store: Error fetching comments:", error);
          const errorMessage = "Failed to fetch comments. Please try again.";

          set((state) => ({
            comments: {
              ...state.comments,
              [blogId]: {
                ...state.comments[blogId],
                isLoading: false,
                error: errorMessage,
              },
            },
          }));

          return {
            success: false,
            message: errorMessage,
          };
        }
      },

      // Update a comment
      updateComment: async (commentId, commentText, token) => {
        set({ isSubmitting: true, error: null });

        try {
          const result = await commentService.updateComment(
            commentId,
            commentText,
            token
          );

          if (result.success) {
            // Update the comment in all blog comment lists
            set((state) => {
              const updatedComments = { ...state.comments };

              // Find and update the comment in all blog comment lists
              Object.keys(updatedComments).forEach((blogId) => {
                if (updatedComments[blogId]?.comments) {
                  updatedComments[blogId].comments = updatedComments[
                    blogId
                  ].comments.map((comment) =>
                    comment._id === commentId ? result.data : comment
                  );
                }
              });

              return {
                comments: updatedComments,
                isSubmitting: false,
                error: null,
              };
            });

            return {
              success: true,
              message: result.message,
              data: result.data,
            };
          } else {
            set({ isSubmitting: false, error: result.message });
            return {
              success: false,
              message: result.message,
              errors: result.errors,
            };
          }
        } catch (error) {
          console.error("Store: Error updating comment:", error);
          const errorMessage = "Failed to update comment. Please try again.";
          set({ isSubmitting: false, error: errorMessage });
          return {
            success: false,
            message: errorMessage,
          };
        }
      },

      // Delete a comment
      deleteComment: async (commentId, blogId, token) => {
        set({ isSubmitting: true, error: null });

        try {
          const result = await commentService.deleteComment(commentId, token);

          if (result.success) {
            // Remove the comment from the blog's comment list
            set((state) => ({
              comments: {
                ...state.comments,
                [blogId]: {
                  ...state.comments[blogId],
                  comments:
                    state.comments[blogId]?.comments.filter(
                      (comment) => comment._id !== commentId
                    ) || [],
                  pagination: {
                    ...state.comments[blogId]?.pagination,
                    totalComments: Math.max(
                      0,
                      (state.comments[blogId]?.pagination?.totalComments || 1) -
                        1
                    ),
                  },
                },
              },
              isSubmitting: false,
              error: null,
            }));

            return {
              success: true,
              message: result.message,
            };
          } else {
            set({ isSubmitting: false, error: result.message });
            return {
              success: false,
              message: result.message,
            };
          }
        } catch (error) {
          console.error("Store: Error deleting comment:", error);
          const errorMessage = "Failed to delete comment. Please try again.";
          set({ isSubmitting: false, error: errorMessage });
          return {
            success: false,
            message: errorMessage,
          };
        }
      },

      // Load more comments (for pagination)
      loadMoreComments: async (blogId, page, options = {}) => {
        const currentData = get().comments[blogId];
        if (!currentData || currentData.isLoading) return;

        // Don't load if no more pages
        if (currentData.pagination && !currentData.pagination.hasNextPage) {
          return {
            success: false,
            message: "No more comments to load",
          };
        }

        // Set loading state
        set((state) => ({
          comments: {
            ...state.comments,
            [blogId]: {
              ...state.comments[blogId],
              isLoading: true,
            },
          },
        }));

        try {
          const result = await commentService.getCommentsByBlogId(blogId, {
            ...options,
            page,
          });

          if (result.success) {
            set((state) => ({
              comments: {
                ...state.comments,
                [blogId]: {
                  comments: [
                    ...(state.comments[blogId]?.comments || []),
                    ...result.data.comments,
                  ],
                  pagination: result.data.pagination,
                  isLoading: false,
                  error: null,
                },
              },
            }));

            return {
              success: true,
              data: result.data,
            };
          } else {
            set((state) => ({
              comments: {
                ...state.comments,
                [blogId]: {
                  ...state.comments[blogId],
                  isLoading: false,
                  error: result.message,
                },
              },
            }));

            return {
              success: false,
              message: result.message,
            };
          }
        } catch (error) {
          console.error("Store: Error loading more comments:", error);
          const errorMessage = "Failed to load more comments.";

          set((state) => ({
            comments: {
              ...state.comments,
              [blogId]: {
                ...state.comments[blogId],
                isLoading: false,
                error: errorMessage,
              },
            },
          }));

          return {
            success: false,
            message: errorMessage,
          };
        }
      },

      // Clear comments for a specific blog
      clearCommentsForBlog: (blogId) => {
        set((state) => {
          const updatedComments = { ...state.comments };
          delete updatedComments[blogId];
          return { comments: updatedComments };
        });
      },

      // Clear all comments
      clearAllComments: () => {
        set({ comments: {}, error: null });
      },

      // Clear errors
      clearError: () => {
        set({ error: null });
      },

      // Getters (computed values)
      getCommentsForBlog: (blogId) => {
        const state = get();
        return (
          state.comments[blogId] || {
            comments: [],
            pagination: {},
            isLoading: false,
            error: null,
          }
        );
      },

      getCommentCount: (blogId) => {
        const state = get();
        return state.comments[blogId]?.comments?.length || 0;
      },

      isLoadingComments: (blogId) => {
        const state = get();
        return state.comments[blogId]?.isLoading || false;
      },

      getCommentsError: (blogId) => {
        const state = get();
        return state.comments[blogId]?.error || null;
      },
    }),
    {
      name: "comment-store",
    }
  )
);

export { useCommentStore };
