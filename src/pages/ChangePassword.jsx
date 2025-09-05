import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, Eye, EyeOff, CheckCircle, ArrowLeft, Lock } from "lucide-react";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const { changePassword, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when fields change
  useEffect(() => {
    if (localError) {
      setLocalError("");
    }
    if (error) {
      clearError();
    }
  }, [currentPassword, newPassword, confirmPassword, error, clearError]);

  // Real-time password matching validation
  useEffect(() => {
    if (confirmPassword.length > 0) {
      const matches = newPassword === confirmPassword;
      setPasswordsMatch(matches);
    } else {
      setPasswordsMatch(true);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setLocalError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setLocalError("New password must be different from current password");
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword);

      if (result.success) {
        toast.success("Password changed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Navigate back to posts or previous page
        setTimeout(() => {
          navigate("/posts");
        }, 500);
      } else {
        toast.error(result.message || "Failed to change password", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Change Password</h1>
          <p className="text-muted-foreground mt-2">
            Update your password to keep your account secure
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription>
                Logged in as <strong>{user?.username}</strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Error Alert */}
          {(localError || error) && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{localError || error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isLoading}
                  className={
                    error && error.includes("Current password")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  disabled={isLoading}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  className={
                    localError && newPassword.length < 6 && newPassword.length > 0
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  disabled={isLoading}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters long and different from current password
              </p>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className={
                    !passwordsMatch && confirmPassword.length > 0
                      ? "border-red-500 focus:border-red-500"
                      : passwordsMatch && confirmPassword.length > 0
                      ? "border-green-500 focus:border-green-500"
                      : ""
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password match indicator */}
              {confirmPassword.length > 0 && (
                <div className="flex items-center space-x-2">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <p className="text-xs text-green-600">Passwords match</p>
                    </>
                  ) : (
                    <>
                      <div className="h-4 w-4 rounded-full bg-red-500" />
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={
                  isLoading || 
                  !passwordsMatch || 
                  newPassword.length < 6 ||
                  !currentPassword.trim() ||
                  currentPassword === newPassword
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}