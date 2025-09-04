import { useState } from "react";
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const { setSelectedPage } = useNavigationStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const result = login(username.trim(), password);

    if (result.success) {
      setSelectedPage("posts");
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => setSelectedPage("register")}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="text-xs space-y-1">
              <div>admin / admin123</div>
              <div>john_doe / password</div>
              <div>jane_smith / secret</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
