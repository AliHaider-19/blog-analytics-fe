"use client";

import { useAuthStore } from "../store/useAuthStore";
import { useNavigationStore } from "../store/useNavigationStore";
import { Button } from "../components/ui/button";
import {
  LogOut,
  PlusCircle,
  BarChart3,
  FileText,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { selectedPage, setSelectedPage } = useNavigationStore();

  const handleLogout = () => {
    logout();
    setSelectedPage("posts");
  };

  const navItems = isAuthenticated()
    ? [
        { id: "posts", label: "Posts", icon: FileText },
        { id: "add-post", label: "Add Post", icon: PlusCircle },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
      ]
    : [
        { id: "posts", label: "Posts", icon: FileText },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "login", label: "Login", icon: LogIn },
        { id: "register", label: "Register", icon: UserPlus },
      ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">
              Blog Analytics
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedPage === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPage(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}

            {/* User Info & Logout */}
            {isAuthenticated() && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  Welcome, {user?.username}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
