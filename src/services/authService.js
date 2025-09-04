const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed", // Use 'message' not 'error'
        };
      }

      return {
        success: true,
        message: data.message,
        data: data.data, // Include the full data object
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  }
  async register(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Registration failed",
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
  }

  async getProfile(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get profile");
      }

      return {
        success: true,
        user: data.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Network error. Please try again.",
      };
    }
  }
}

export default new AuthService();
