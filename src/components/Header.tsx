import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from "@/components/ui/button";
import { Menu, LogIn, UserPlus, LogOut, User, Shield, MessageCircle, Info, Calculator, Flame, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { isAdminUser } from '@/utils/adminUtils';
import { useState } from 'react';

// WhatsApp support function
const openWhatsAppSupport = () => {
  // Your WhatsApp number
  const phoneNumber = '966561026563';
  const message = 'Hello, I need help with the Coffee Quality Control system.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  // Open in new tab
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

export default function Header() {
  const { user } = useAuth();
  const [showAdminNotice, setShowAdminNotice] = useState(false);

  // Use centralized admin check
  const isAdmin = isAdminUser(user);

  return (
    <header className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-coffee-roast to-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">QC</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Quality Control</h1>
        </div>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/green" className="text-coffee-green hover:text-coffee-green/80 font-medium transition-colors">
            Green Beans
          </Link>
          <Link to="/roast" className="text-coffee-roast hover:text-coffee-roast/80 font-medium transition-colors">
            Roast Profiles
          </Link>
          <Link to="/cupping" className="text-accent hover:text-accent/80 font-medium transition-colors">
            Cupping Sessions
          </Link>
          <div className="relative group">
            <button className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1">
              <Calculator className="h-4 w-4" />
              Calculators
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link to="/calculator" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                <Calculator className="h-4 w-4 inline mr-2" />
                Quality Calculator
              </Link>
              <Link to="/roast-calculator" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                <Flame className="h-4 w-4 inline mr-2" />
                Roast Calculator
              </Link>
              <Link to="/cupping-calculator" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                <FileText className="h-4 w-4 inline mr-2" />
                Cupping Calculator
              </Link>
            </div>
          </div>
          <Link to="/profile" className="text-purple-500 hover:text-purple-500/80 font-medium transition-colors">
            Profile
          </Link>
          {/* Admin Panel Link - Only show for admin users */}
          {isAdmin && (
            <Link to="/admin" className="text-destructive hover:text-destructive/80 font-medium transition-colors flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-2">
          {/* WhatsApp Support Button - hidden on mobile */}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 hidden md:flex"
            onClick={openWhatsAppSupport}
          >
            <MessageCircle className="h-4 w-4 text-green-500" />
            <span>Support</span>
          </Button>

          {/* Info Button for Admin Notice */}
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 hidden md:flex"
              onClick={() => setShowAdminNotice(true)}
            >
              <Info className="h-4 w-4 text-blue-500" />
            </Button>
          )}

          {/* Auth Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-medium">Calculators</DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculator" className="gap-2 pl-6">
                      <Calculator className="h-4 w-4" />
                      Quality Calculator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/roast-calculator" className="gap-2 pl-6">
                      <Flame className="h-4 w-4" />
                      Roast Calculator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/cupping-calculator" className="gap-2 pl-6">
                      <FileText className="h-4 w-4" />
                      Cupping Calculator
                    </Link>
                  </DropdownMenuItem>
                  {/* Admin Panel Link - Only show for admin users */}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="gap-2">
                          <Shield className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowAdminNotice(true)} className="gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        Admin Guide
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => supabase.auth.signOut()} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/auth" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {/* WhatsApp Support in Dropdown - visible on mobile */}
              <DropdownMenuItem onClick={openWhatsAppSupport} className="gap-2 md:hidden">
                <MessageCircle className="h-4 w-4 text-green-500" />
                WhatsApp Support
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Admin Notice Popup */}
      <AlertDialog open={showAdminNotice} onOpenChange={setShowAdminNotice}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              Admin Capabilities
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Welcome, Administrator! You have access to the following capabilities:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Upload new coffee profiles and assessments</li>
                <li>Edit existing records and data entries</li>
                <li>Delete unwanted or incorrect information</li>
                <li>Manage user accounts and permissions</li>
                <li>View detailed system analytics and reports</li>
                <li>Customize frontend appearance and settings</li>
                <li>Monitor system health and performance</li>
              </ul>
              <p className="pt-2">Use the Admin Panel to access all these features.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAdminNotice(false)}>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}