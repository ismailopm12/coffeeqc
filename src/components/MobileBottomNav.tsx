import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Coffee, Flame, FileText, User, Shield, Home, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAdminUser } from '@/utils/adminUtils';
import { useState, useEffect } from 'react';

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Use centralized admin check
  const isAdmin = isAdminUser(user);
  
  // State to track if we're in admin mode
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Check if we're on an admin page to set admin mode
  useEffect(() => {
    setIsAdminMode(location.pathname.startsWith('/admin'));
  }, [location.pathname]);

  // Define navigation items for regular users
  const regularNavItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
      color: "text-primary"
    },
    {
      path: "/green",
      label: "Green",
      icon: Coffee,
      color: "text-coffee-green"
    },
    {
      path: "/roast", 
      label: "Roast",
      icon: Flame,
      color: "text-coffee-roast"
    },
    {
      path: "/cupping",
      label: "Cupping", 
      icon: FileText,
      color: "text-accent"
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
      color: "text-purple-500"
    }
  ];

  // Define navigation items for admin users (admin-only view) with more professional labels
  const adminNavItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
      color: "text-primary"
    },
    {
      path: "/admin",
      label: "Dashboard",
      icon: Home,
      color: "text-primary"
    },
    {
      path: "/admin/users",
      label: "User Mgmt",
      icon: User,
      color: "text-blue-500"
    },
    {
      path: "/admin/green",
      label: "Green QA",
      icon: Coffee,
      color: "text-coffee-green"
    },
    {
      path: "/admin/roast",
      label: "Roast QA",
      icon: Flame,
      color: "text-coffee-roast"
    },
    {
      path: "/admin/cupping",
      label: "Cupping QA",
      icon: FileText,
      color: "text-accent"
    }
  ];

  // Determine which navigation items to show
  const navItems = isAdminMode ? adminNavItems : regularNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/admin' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-2 min-w-0 flex-1 rounded-lg transition-all",
                isActive 
                  ? "bg-secondary shadow-warm" 
                  : "hover:bg-secondary/50"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-colors",
                  isActive ? item.color : "text-muted-foreground"
                )} 
              />
              <span 
                className={cn(
                  "text-xs font-medium transition-colors text-center",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        {/* Calculator menu icon for non-admin users */}
        {!isAdminMode && (
          <Link
            to="/calculator"
            className={cn(
              "flex flex-col items-center justify-center px-2 py-2 min-w-0 flex-1 rounded-lg transition-all",
              location.pathname.startsWith("/calculator")
                ? "bg-secondary shadow-warm" 
                : "hover:bg-secondary/50"
            )}
          >
            <Calculator 
              className={cn(
                "h-5 w-5 mb-1 transition-colors",
                location.pathname.startsWith("/calculator") ? "text-primary" : "text-muted-foreground"
              )} 
            />
            <span 
              className={cn(
                "text-xs font-medium transition-colors text-center",
                location.pathname.startsWith("/calculator") ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Calculator
            </span>
          </Link>
        )}
      </div>
      
      {/* Admin toggle button - only shown for admin users */}
      {isAdmin && (
        <div className="flex items-center justify-center px-1 py-2 border-t border-border">
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors",
              isAdminMode 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-primary text-primary-foreground"
            )}
          >
            <Shield className="h-3 w-3" />
            <span className="hidden sm:inline">
              {isAdminMode ? "Exit Admin" : "Admin Mode"}
            </span>
            <span className="sm:hidden">
              {isAdminMode ? "Exit" : "Admin"}
            </span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default MobileBottomNav;