import { useNavigationStore } from "./store/useNavigationStore";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddPost from "./pages/AddPost";
import PostsList from "./pages/PostsList";
import Analytics from "./pages/Analytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { selectedPage } = useNavigationStore();

  const renderPage = () => {
    switch (selectedPage) {
      case "login":
        return <Login />;
      case "register":
        return <Register />;
      case "add-post":
        return <AddPost />;
      case "posts":
        return <PostsList />;
      case "analytics":
        return <Analytics />;
      default:
        return <PostsList />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{renderPage()}</main>

      {/* Toast Container - Required for react-toastify to work */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
