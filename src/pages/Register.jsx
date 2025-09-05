/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, Eye, EyeOff, CheckCircle, UserPlus, Sparkles, ArrowRight, Mail, User, Lock } from "lucide-react";
import { toast } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);

  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/posts", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
  }, [username, email, password, confirmPassword, error, clearError]);

  // Real-time password matching validation
  useEffect(() => {
    if (confirmPassword.length > 0) {
      const matches = password === confirmPassword;
      setPasswordsMatch(matches);
      setShowPasswordMismatch(confirmPassword.length > 0 && !matches);
    } else {
      setPasswordsMatch(true);
      setShowPasswordMismatch(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setLocalError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address");
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

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username.trim())) {
      setLocalError("Username must only contain letters and numbers");
      return;
    }

    try {
      console.log("Component: About to call register...");
      const result = await register(username.trim(), email.trim(), password);
      console.log("Component: Register result:", result);

      if (result.success) {
        toast.success(result.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        navigate("/login");
      } else {
        // Handle backend errors - show toast for errors too
        console.log("Component: Registration failed:", result.message);
        toast.error(result.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLocalError(result.message);
      }
    } catch (err) {
      // Handle network or unexpected errors
      console.error("Component: Registration error:", err);
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

  // Prioritize backend errors over local errors
  const displayError = error || localError;

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
              <UserPlus className="h-8 w-8 text-emerald-600" />
              <motion.div
                className="absolute -inset-2 bg-emerald-500/20 rounded-full -z-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Join Us Today
            </h1>
          </motion.div>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create your account and start your blogging journey
          </motion.p>
        </motion.div>

        <Card className="card-glass relative overflow-hidden shadow-2xl">
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 opacity-50"
            animate={{
              background: [
                "linear-gradient(0deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2), rgba(16,185,129,0.2))",
                "linear-gradient(90deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2), rgba(16,185,129,0.2))",
                "linear-gradient(180deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2), rgba(16,185,129,0.2))",
                "linear-gradient(270deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2), rgba(16,185,129,0.2))",
                "linear-gradient(360deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2), rgba(16,185,129,0.2))",
              ],
            }}
            transition={{
              duration: 10,
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
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              </motion.div>
              <CardDescription>
                Join our community of passionate bloggers
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
                  <Label htmlFor="username" className="text-sm font-medium flex items-center space-x-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span>Username</span>
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a unique username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className={`h-11 bg-background/50 border-muted-foreground/20 focus:border-emerald-500/50 focus:bg-background transition-all duration-300 ${
                        error && error.includes("Username")
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    3-30 characters, letters and numbers only
                  </p>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="email" className="text-sm font-medium flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Email Address</span>
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className={`h-11 bg-background/50 border-muted-foreground/20 focus:border-blue-500/50 focus:bg-background transition-all duration-300 ${
                        error && error.includes("Email")
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    We'll use this for password reset and notifications
                  </p>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="password" className="text-sm font-medium flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-purple-600" />
                    <span>Password</span>
                  </Label>
                  <motion.div
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-11 bg-background/50 border-muted-foreground/20 focus:border-purple-500/50 focus:bg-background transition-all duration-300 pr-12"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-purple-600 transition-colors"
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

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-purple-600" />
                    <span>Confirm Password</span>
                  </Label>
                  <motion.div
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className={`h-11 bg-background/50 border-muted-foreground/20 focus:border-purple-500/50 focus:bg-background transition-all duration-300 pr-12 ${
                        showPasswordMismatch
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-purple-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                    {confirmPassword && passwordsMatch && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-10 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle size={18} className="text-green-500" />
                      </motion.div>
                    )}
                  </motion.div>
                  {showPasswordMismatch && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs text-red-500"
                    >
                      Passwords do not match
                    </motion.p>
                  )}
                </motion.div>

                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive" className="bg-red-50/80 border-red-200/80 backdrop-blur-sm">
                      <AlertDescription className="text-red-800">{displayError}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading || showPasswordMismatch}
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </motion.div>
                    ) : (
                      <motion.div className="flex items-center">
                        Create Account
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
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
                transition={{ delay: 0.9 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-foreground/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">Already a member?</span>
                  </div>
                </div>

                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/50 text-blue-700 hover:from-blue-100 hover:to-emerald-100 hover:border-blue-300/50 transition-all duration-300 font-medium"
                    disabled={isLoading}
                  >
                    Sign in to existing account
                  </button>
                </motion.div>
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
