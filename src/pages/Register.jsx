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
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);

  const { register, isLoading, error, clearError } = useAuthStore();
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
  }, [username, password, confirmPassword, error, clearError]);

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
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
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
      const result = await register(username.trim(), password);
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
        setPassword("");
        setConfirmPassword("");

        setSelectedPage("login");
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
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className={
                  error && error.includes("Username")
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
              <p className="text-xs text-muted-foreground">
                Must be 3-30 characters, letters and numbers only
              </p>
            </div>

            {/* Password field with eye toggle */}
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password field with eye toggle and validation */}
            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className={`${
                    showPasswordMismatch
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : confirmPassword && passwordsMatch
                      ? ""
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
                {/* {confirmPassword && passwordsMatch && (
                  <CheckCircle
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  />
                )} */}
              </div>
              {showPasswordMismatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {displayError && (
              <Alert variant="destructive">
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || showPasswordMismatch}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={() => setSelectedPage("login")}
              className="text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
