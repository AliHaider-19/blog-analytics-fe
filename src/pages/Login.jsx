/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Loader2,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || "/posts";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors when component unmounts or inputs change
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  useEffect(() => {
    if (localError) {
      setLocalError("");
    }
    if (error) {
      clearError();
    }
  }, [username, password, error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation
    if (!username.trim() || !password.trim()) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (username.trim().length < 3) {
      setLocalError("Username must be at least 3 characters long");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    try {
      const result = await login(username.trim(), password);
      console.log("Component: Login result:", result);

      if (result.success) {
        // Show success toast
        toast.success(result.message || "Login successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate to the intended page or posts page
        const from = location.state?.from?.pathname || "/posts";
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        // Handle login failure
        console.log("Component: Login failed:", result.message);
        toast.error(result.message || "Login failed. Please try again.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLocalError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Component: Login error:", err);
      const errorMessage =
        "Network error. Please check your connection and try again.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setLocalError(errorMessage);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <LogIn className="h-8 w-8 text-primary" />
              <motion.div
                className="absolute -inset-2 bg-primary/20 rounded-full -z-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
          </motion.div>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Enter your credentials to access your account
          </motion.p>
        </motion.div>

        <Card className="card-glass relative overflow-hidden shadow-2xl">
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 opacity-50"
            animate={{
              background: [
                "linear-gradient(0deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2), rgba(59,130,246,0.2))",
                "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2), rgba(59,130,246,0.2))",
                "linear-gradient(180deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2), rgba(59,130,246,0.2))",
                "linear-gradient(270deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2), rgba(59,130,246,0.2))",
                "linear-gradient(360deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2), rgba(59,130,246,0.2))",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative z-10">
            <CardHeader className="space-y-1 pb-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-2"
              >
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              </motion.div>
              <CardDescription>
                Ready to continue your blogging journey?
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="h-11 bg-background/50 border-muted-foreground/20 focus:border-primary/50 focus:bg-background transition-all duration-300"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <motion.div
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-11 bg-background/50 border-muted-foreground/20 focus:border-primary/50 focus:bg-background transition-all duration-300 pr-12"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters long
                  </p>
                </motion.div>

                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      variant="destructive"
                      className="bg-red-50/80 border-red-200/80 backdrop-blur-sm"
                    >
                      <AlertDescription className="text-red-800">
                        {displayError}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </motion.div>
                    ) : (
                      <motion.div className="flex items-center">
                        Sign In
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-foreground/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">
                      Quick Links
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center text-sm">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/forgot-password"
                      className="block p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300/50 transition-all duration-300 font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => navigate("/register")}
                      className="w-full p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-green-700 hover:from-green-100 hover:to-emerald-100 hover:border-green-300/50 transition-all duration-300 font-medium"
                      disabled={isLoading}
                    >
                      Create Account
                    </button>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-start space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <Sparkles className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">
                      Demo Account Info
                    </p>
                    <div className="text-xs space-y-1 text-amber-700">
                      <div>• Create a new account to test the registration</div>
                      <div>
                        • Username: 3+ characters, Password: 6+ characters
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
