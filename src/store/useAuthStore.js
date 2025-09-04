import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      users: [
        { id: 1, username: "admin", password: "admin123" },
        { id: 2, username: "john_doe", password: "password" },
        { id: 3, username: "jane_smith", password: "secret" },
      ],

      login: (username, password) => {
        const { users } = get()
        const user = users.find((u) => u.username === username && u.password === password)

        if (user) {
          const token = `mock_token_${user.id}_${Date.now()}`
          set({ user, token })
          return { success: true }
        }

        return { success: false, error: "Invalid credentials" }
      },

      register: (username, password) => {
        const { users } = get()

        if (users.find((u) => u.username === username)) {
          return { success: false, error: "Username already exists" }
        }

        const newUser = {
          id: users.length + 1,
          username,
          password,
        }

        const updatedUsers = [...users, newUser]
        const token = `mock_token_${newUser.id}_${Date.now()}`

        set({
          users: updatedUsers,
          user: newUser,
          token,
        })

        return { success: true }
      },

      logout: () => {
        set({ user: null, token: null })
      },

      isAuthenticated: () => {
        const { user, token } = get()
        return !!(user && token)
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        users: state.users,
      }),
    },
  ),
)

export { useAuthStore }
