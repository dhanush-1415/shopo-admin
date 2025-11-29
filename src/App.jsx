import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Variations from "./pages/Variations";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Categories from "./pages/Categories";
import Discounts from "./pages/Discounts";
import Blogs from "./pages/Blogs";
// import SizeChart from "./pages/SizeChart";

import Logistics from "./pages/Logistics";

import GiftCards from "./pages/GiftCards";
import LoyaltyProgram from "./pages/LoyaltyProgram";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes - All routes inside MainLayout require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/variations" element={<Variations />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/discounts" element={<Discounts />} />
                <Route path="/blogs" element={<Blogs />} />
                {/* <Route path="/size-chart" element={<SizeChart />} /> */}
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/loyalty" element={<LoyaltyProgram />} />
              </Route>
            </Route>
            
            {/* Catch all - redirect to login if not authenticated, otherwise 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
