import { create } from "zustand"

const useAnalyticsStore = create((set, get) => ({
  getTopAuthors: (posts) => {
    const authorCounts = {}

    posts.forEach((post) => {
      authorCounts[post.author] = (authorCounts[post.author] || 0) + 1
    })

    return Object.entries(authorCounts)
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
  },

  getMostCommentedPosts: (posts) => {
    return posts
      .map((post) => ({
        ...post,
        commentCount: post.comments.length,
      }))
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 5)
  },

  getPostsPerDay: (posts) => {
    const last7Days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const postsOnDate = posts.filter((post) => {
        const postDate = new Date(post.createdAt).toISOString().split("T")[0]
        return postDate === dateStr
      }).length

      last7Days.push({
        date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        posts: postsOnDate,
      })
    }

    return last7Days
  },
}))

export { useAnalyticsStore }
