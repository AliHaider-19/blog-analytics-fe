/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigationStore } from "../store/useNavigationStore";
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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify"; // Add this import

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError } = useAuthStore();
  const { setSelectedPage } = useNavigationStore();

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
      console.log("Component: About to call login...");
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

        // Navigate to posts page
        setTimeout(() => {
          setSelectedPage("posts");
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
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters long
              </p>
            </div>

            {displayError && (
              <Alert variant="destructive">
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => setSelectedPage("register")}
              className="text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <div>Create a new account to test the registration</div>
              <div>Username: 3+ characters, Password: 6+ characters</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
