import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  LogOut,
  PlusCircle,
  BarChart3,
  FileText,
  LogIn,
  UserPlus,
  User,
  Settings,
  Lock,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/posts");
  };

  const navItems = isAuthenticated()
    ? [
        { path: "/posts", label: "Posts", icon: FileText },
        { path: "/add-post", label: "Add Post", icon: PlusCircle },
        { path: "/analytics", label: "Analytics", icon: BarChart3 },
      ]
    : [
        { path: "/posts", label: "Posts", icon: FileText },
        { path: "/analytics", label: "Analytics", icon: BarChart3 },
        { path: "/login", label: "Login", icon: LogIn },
        { path: "/register", label: "Register", icon: UserPlus },
      ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/60"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <BarChart3 className="h-7 w-7 text-primary" />
              <motion.div
                className="absolute -inset-1 bg-primary/20 rounded-full -z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            </motion.div>
            <div className="flex flex-col">
              <motion.h1 
                className="text-xl font-bold text-foreground group-hover:text-primary transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Blog Analytics
              </motion.h1>
              <motion.div
                className="h-0.5 bg-gradient-to-r from-primary to-primary/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            <motion.div 
              className="flex items-center space-x-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                               (item.path === "/posts" && location.pathname === "/");

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-2 relative overflow-hidden transition-all duration-300 ${
                        isActive ? 
                        "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : 
                        "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>
                      <span className="hidden sm:inline">{item.label}</span>
                      
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 -z-10"
                          layoutId="activeTab"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* User Menu & Logout */}
            <AnimatePresence>
              {isAuthenticated() && (
                <motion.div 
                  className="flex items-center space-x-3 ml-4 pl-4 border-l border-border/50"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="hidden md:flex items-center space-x-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Welcome, <span className="text-primary">{user?.username}</span>
                    </span>
                  </motion.div>
                  
                  {/* User dropdown menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:from-primary/20 hover:to-primary/10 hover:border-primary/30 transition-all duration-300"
                        >
                          <User className="h-4 w-4" />
                          <span className="hidden sm:inline">Account</span>
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate("/change-password")}>
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Dedicated Logout Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700 hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:text-red-800 transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Animated bottom border */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </motion.nav>
  );
}
