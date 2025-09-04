"use client"

import { useEffect } from "react"
import { usePostStore } from "./store/usePostStore"
import { useNavigationStore } from "./store/useNavigationStore"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AddPost from "./pages/AddPost"
import PostsList from "./pages/PostsList"
import Analytics from "./pages/Analytics"

function App() {
  const { selectedPage } = useNavigationStore()
  const { initializeMockData } = usePostStore()

  useEffect(() => {
    // Initialize mock data on app start
    initializeMockData()
  }, [initializeMockData])

  const renderPage = () => {
    switch (selectedPage) {
      case "login":
        return <Login />
      case "register":
        return <Register />
      case "add-post":
        return <AddPost />
      case "posts":
        return <PostsList />
      case "analytics":
        return <Analytics />
      default:
        return <PostsList />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{renderPage()}</main>
    </div>
  )
}

export default App
