import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "@/pages/Index";
import Green from "@/pages/Green";
import Roast from "@/pages/Roast";
import Cupping from "@/pages/Cupping";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
// Add Admin component import
import Admin from "@/pages/Admin";
// Add Calculator components import
import CoffeeCalculator from "@/pages/CoffeeCalculator";
import RoastCalculator from "@/pages/RoastCalculator";
import CuppingCalculatorPage from "@/pages/CuppingCalculatorPage";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
// Import WelcomePopup component
import WelcomePopup from "@/components/WelcomePopup";

// WhatsApp support function
const openWhatsAppSupport = () => {
  // Your WhatsApp number
  const phoneNumber = '966561026563';
  const message = 'Hello, I need help with the Coffee Quality Control system.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  // Open in new tab
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

const queryClient = new QueryClient();

const App = () => {
  const [showWhatsAppButton] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="container mx-auto px-4 py-6 flex-grow pb-28 md:pb-6">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/green" element={<Green />} />
                  <Route path="/roast" element={<Roast />} />
                  <Route path="/cupping" element={<Cupping />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/calculator" element={<CoffeeCalculator />} />
                  <Route path="/roast-calculator" element={<RoastCalculator />} />
                  <Route path="/cupping-calculator" element={<CuppingCalculatorPage />} />
                  {/* Admin routes */}
                  <Route path="/admin/*" element={<Admin />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <MobileBottomNav />
              <WelcomePopup />
              
              {/* Floating WhatsApp Button for Mobile */}
              {showWhatsAppButton && (
                <button
                  onClick={openWhatsAppSupport}
                  className="md:hidden fixed bottom-24 right-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
                  aria-label="WhatsApp Support"
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
              )}
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;