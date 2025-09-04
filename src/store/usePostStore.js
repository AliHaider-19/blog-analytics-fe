import { create } from "zustand"

const usePostStore = create((set, get) => ({
  posts: [],

  initializeMockData: () => {
    const mockPosts = [
      {
        _id: "1",
        title: "Getting Started with React",
        content:
          "React is a powerful JavaScript library for building user interfaces. In this post, we will explore the basics of React and how to get started with your first component.",
        author: "john_doe",
        createdAt: new Date("2024-01-15").toISOString(),
        comments: [
          { commenter: "jane_smith", text: "Great introduction to React!" },
          { commenter: "admin", text: "Very helpful for beginners." },
        ],
      },
      {
        _id: "2",
        title: "State Management with Zustand",
        content:
          "Zustand is a lightweight state management solution for React applications. It provides a simple API and great TypeScript support.",
        author: "jane_smith",
        createdAt: new Date("2024-01-16").toISOString(),
        comments: [
          { commenter: "john_doe", text: "I love how simple Zustand is!" },
          { commenter: "admin", text: "Much easier than Redux." },
          { commenter: "john_doe", text: "The persist middleware is amazing." },
        ],
      },
      {
        _id: "3",
        title: "Building Analytics Dashboards",
        content:
          "Analytics dashboards are crucial for understanding user behavior and application performance. This post covers best practices for building effective dashboards.",
        author: "admin",
        createdAt: new Date("2024-01-17").toISOString(),
        comments: [{ commenter: "jane_smith", text: "The chart examples are very useful." }],
      },
      {
        _id: "4",
        title: "Modern CSS with Tailwind",
        content:
          "Tailwind CSS revolutionizes how we write CSS by providing utility-first classes that make styling faster and more consistent.",
        author: "john_doe",
        createdAt: new Date("2024-01-18").toISOString(),
        comments: [],
      },
    ]

    set({ posts: mockPosts })
  },

  addPost: (title, content, author) => {
    const { posts } = get()
    const newPost = {
      _id: (posts.length + 1).toString(),
      title,
      content,
      author,
      createdAt: new Date().toISOString(),
      comments: [],
    }

    set({ posts: [...posts, newPost] })
  },

  addComment: (postId, commenter, text) => {
    const { posts } = get()
    const updatedPosts = posts.map((post) => {
      if (post._id === postId) {
        return {
          ...post,
          comments: [...post.comments, { commenter, text }],
        }
      }
      return post
    })

    set({ posts: updatedPosts })
  },

  getPostById: (id) => {
    const { posts } = get()
    return posts.find((post) => post._id === id)
  },
}))

export { usePostStore }
