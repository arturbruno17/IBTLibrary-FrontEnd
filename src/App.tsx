
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {Role} from "@/types";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import BookDetails from "./pages/BookDetails";
import AddBook from "./pages/AddBook";
import Loans from "./pages/Loans";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const App = () => {
  // Create a client inside the component to prevent the useEffect error
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

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
              <Route path="/registro" element={<Register />} />

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
                path="/painel"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/catalogo"
                element={
                  <ProtectedRoute>
                    <Catalog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/livros/:id"
                element={
                  <ProtectedRoute>
                    <BookDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/emprestimos"
                element={
                  <ProtectedRoute>
                    <Loans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Routes for librarians and admins */}
              <Route
                path="/adicionar-livro"
                element={
                  <ProtectedRoute allowedRoles={[Role.LIBRARIAN, Role.ADMIN]}>
                    <AddBook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editar-livro/:id"
                element={
                  <ProtectedRoute allowedRoles={[Role.LIBRARIAN, Role.ADMIN]}>
                    <AddBook />
                  </ProtectedRoute>
                }
              />

              {/* Admin-only routes */}
              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN, Role.LIBRARIAN, Role.READER]}>
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
