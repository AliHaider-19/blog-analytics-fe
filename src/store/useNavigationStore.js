import { create } from "zustand";

const useNavigationStore = create((set) => ({
  selectedPage: "posts", // Default page
  selectedPost: null, // For storing selected post for editing/viewing

  // Set the current page
  setSelectedPage: (page) => set({ selectedPage: page }),

  // Set selected post (for edit/view operations)
  setSelectedPost: (post) => set({ selectedPost: post }),

  // Clear selected post
  clearSelectedPost: () => set({ selectedPost: null }),

  // Navigation helper methods
  navigateToLogin: () => set({ selectedPage: "login", selectedPost: null }),
  navigateToRegister: () =>
    set({ selectedPage: "register", selectedPost: null }),
  navigateToAddPost: () =>
    set({ selectedPage: "add-post", selectedPost: null }),
  navigateToEditPost: (post) =>
    set({ selectedPage: "edit-post", selectedPost: post }),
  navigateToViewPost: (post) =>
    set({ selectedPage: "view-post", selectedPost: post }),
  navigateToPosts: () => set({ selectedPage: "posts", selectedPost: null }),
  navigateToAnalytics: () =>
    set({ selectedPage: "analytics", selectedPost: null }),
  navigateToProfile: () => set({ selectedPage: "profile", selectedPost: null }),
}));

export { useNavigationStore };
