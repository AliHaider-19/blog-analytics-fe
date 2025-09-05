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
          const result = await authService.login(username, password);

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
            set({ isLoading: false, error: result.message });
            return { success: false, message: result.message };
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Login failed. Please try again.";
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true, error: null });

        try {
          console.log("Store: Calling authService.register...");
          const result = await authService.register(username, email, password);

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

      // Forgot password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authService.forgotPassword(email);
          set({ isLoading: false });
          return result;
        } catch (error) {
          const errorMessage = error.message || "Failed to send reset email";
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      // Reset password
      resetPassword: async (resetToken, password) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authService.resetPassword(resetToken, password);

          if (result.success) {
            // Auto-login after successful password reset
            set({
              user: result.data.user,
              token: result.data.token,
              isLoading: false,
              error: null,
            });
          } else {
            set({ isLoading: false });
          }

          return result;
        } catch (error) {
          const errorMessage = error.message || "Failed to reset password";
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      // Change password
      changePassword: async (currentPassword, newPassword) => {
        const { token } = get();
        set({ isLoading: true, error: null });

        try {
          const result = await authService.changePassword(
            currentPassword,
            newPassword,
            token
          );
          set({ isLoading: false });
          return result;
        } catch (error) {
          const errorMessage = error.message || "Failed to change password";
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
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
