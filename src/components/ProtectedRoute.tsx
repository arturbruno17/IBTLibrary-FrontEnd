
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role | Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If there are allowed roles specified, check if user has permission
  if (allowedRoles) {
    const hasPermission = Array.isArray(allowedRoles)
      ? allowedRoles.some(role => hasRole(role))
      : hasRole(allowedRoles);

    if (!hasPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
