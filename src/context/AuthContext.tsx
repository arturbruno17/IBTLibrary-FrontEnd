
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, Role } from '@/types';
import { authAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
  error: null
};

// Action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'AUTH_ERROR' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.type === 'AUTH_ERROR' ? 'Authentication error' : null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Create context
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerLibrarian: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  clearError: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  registerLibrarian: async () => {},
  logout: () => {},
  updateUser: () => {},
  clearError: () => {},
  hasRole: () => false
});

// Create provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          // For demo purposes, we'll create a simulated user
          // In a real app, you would fetch user data from API
          const simulatedUser: User = {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'reader',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          dispatch({ type: 'UPDATE_USER', payload: simulatedUser });
          dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // In a real app, this would be an actual API call
      // const response = await authAPI.login(email, password);
      
      // For demo purposes, we'll simulate a successful login
      const simulatedResponse = {
        user: {
          id: '1',
          name: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'admin' : email.includes('librarian') ? 'librarian' : 'reader',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'simulated-jwt-token'
      };
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: simulatedResponse 
      });
      
      toast.success(`Welcome back, ${simulatedResponse.user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Invalid credentials' 
      });
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // In a real app, this would be an actual API call
      // const response = await authAPI.register(name, email, password);
      
      // For demo purposes, we'll simulate a successful registration
      const simulatedResponse = {
        user: {
          id: '1',
          name,
          email,
          role: 'reader' as Role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'simulated-jwt-token'
      };
      
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: simulatedResponse 
      });
      
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: 'Registration failed' 
      });
    }
  };

  // Register librarian
  const registerLibrarian = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // In a real app, this would be an actual API call
      // const response = await authAPI.registerLibrarian(name, email, password);
      
      // For demo purposes, we'll simulate a successful registration
      const simulatedResponse = {
        user: {
          id: '1',
          name,
          email,
          role: 'librarian' as Role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'simulated-jwt-token'
      };
      
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: simulatedResponse 
      });
      
      toast.success('Librarian account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: 'Librarian registration failed' 
      });
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.info('You have been logged out');
    navigate('/login');
  };

  // Update user
  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user has the required role
  const hasRole = (roles: Role | Role[]): boolean => {
    if (!state.user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(state.user.role);
    }
    
    return state.user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        registerLibrarian,
        logout,
        updateUser,
        clearError,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
