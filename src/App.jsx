import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import ViewPost from "./pages/ViewPost";
import PostsList from "./pages/PostsList";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen text-foreground relative">
      {/* Subtle floating elements for depth */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-20 right-10 w-48 h-48 bg-purple-500/3 rounded-full blur-3xl pointer-events-none animate-pulse" style={{animationDelay: '2s'}} />
      <div className="fixed top-1/2 left-1/3 w-32 h-32 bg-emerald-500/3 rounded-full blur-2xl pointer-events-none animate-pulse" style={{animationDelay: '4s'}} />
      
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
          <Route path="/" element={<PostsList />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/posts/:id" element={<ViewPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-post"
            element={
              <ProtectedRoute>
                <AddPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
        </Routes>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-50"
      />
    </div>
  );
}

export default App;
