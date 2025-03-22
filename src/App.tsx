
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import BookDetails from "./pages/BookDetails";
import AddBook from "./pages/AddBook";
import Loans from "./pages/Loans";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const App = () => {
  // Create a new QueryClient instance within the component function
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner position="top-right" />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes for all authenticated users */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/catalog" 
                element={
                  <ProtectedRoute>
                    <Catalog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/books/:id" 
                element={
                  <ProtectedRoute>
                    <BookDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/loans" 
                element={
                  <ProtectedRoute>
                    <Loans />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes for librarians and admins */}
              <Route 
                path="/add-book" 
                element={
                  <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                    <AddBook />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-book/:id" 
                element={
                  <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                    <AddBook />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin-only routes */}
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
