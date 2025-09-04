/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../services/authService";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });

        try {
          console.log("Store: Calling authService.login...");
          const result = await authService.login(username, password);

          console.log("Store: authService response:", result);

          if (result.success) {
            console.log("Store: Login successful, setting user data...");
            set({
              user: result.data.user, // Access user from result.data
              token: result.data.token, // Access token from result.data
              isLoading: false,
              error: null,
            });
            return { success: true, message: result.message };
          } else {
            console.log("Store: Login failed:", result.message);
            set({ isLoading: false, error: result.message });
            return { success: false, message: result.message };
          }
        } catch (error) {
          console.log("Store: Caught error:", error);
          const errorMessage =
            error.response?.data?.message || "Login failed. Please try again.";
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      register: async (username, password) => {
        set({ isLoading: true, error: null });

        try {
          console.log("Store: Calling authService.register...");
          const result = await authService.register(username, password);

          // Debug: Log what comes back from authService
          console.log("Store: authService response:", result);

          if (result.success) {
            console.log("Store: Registration successful, setting user data...");
            set({
              user: result.data.user,
              token: result.data.token,
              isLoading: false,
              error: null,
            });
            return { success: true, message: result.message };
          } else {
            console.log(
              "Store: Registration failed, backend returned:",
              result
            );
            set({ isLoading: false, error: result.message });
            return { success: false, message: result.message };
          }
        } catch (error) {
          console.log("Store: Caught error:", error);
          console.log("Store: Error response:", error.response?.data);

          const errorMessage =
            error.response?.data?.message ||
            "Registration failed. Please try again.";
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },
      logout: () => {
        set({ user: null, token: null, error: null });
      },

      isAuthenticated: () => {
        const { user, token } = get();
        return !!(user && token);
      },

      clearError: () => {
        set({ error: null });
      },

      // Verify token and refresh user data
      verifyAuth: async () => {
        const { token } = get();

        if (!token) {
          return false;
        }

        try {
          const result = await authService.getProfile(token);

          if (result.success) {
            set({ user: result.user });
            return true;
          } else {
            set({ user: null, token: null });
            return false;
          }
        } catch (error) {
          set({ user: null, token: null });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export { useAuthStore };
