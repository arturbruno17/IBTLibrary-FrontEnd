import React, {createContext, useContext, useReducer, useEffect} from 'react';
import {AuthState, User, Role} from '@/types';
import {useNavigate} from 'react-router-dom';
import {toast} from "sonner";
import {authAPI} from "@/services/api";
import {jwtDecode} from "jwt-decode";
import {setLogoutCallback} from "@/services/api";

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
                error: action.type === 'AUTH_ERROR' ? 'Erro de autenticação' : null
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
    login: async () => {
    },
    register: async () => {
    },
    registerLibrarian: async () => {
    },
    logout: () => {
    },
    updateUser: () => {
    },
    clearError: () => {
    },
    hasRole: () => false
});




// Create provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();

    useEffect(() => {
        setLogoutCallback(logout);
      }, []);

    // Load user from token on mount
    useEffect(() => {
        const loadUser = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded: {
                        id?: string;
                        name?: string;
                        email: string;
                        role: Role;
                    } = jwtDecode(token);

                    const userFromToken: User = {
                        id: Number(decoded.id ?? decoded.id ?? 0),
                        name: decoded.name ?? decoded.email.split('@')[0],
                        email: decoded.email,
                        role: decoded.role,
                    };

                    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userFromToken, token } });
                } catch (error) {
                    console.error("Erro ao decodificar token:", error);
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
            dispatch({type: 'SET_LOADING', payload: true});
            const response = await authAPI.login(email, password); // resposta tem access_token e refresh_token

            const token = response.access_token;

            // PODE SER opcional: decodificar o token pra extrair infos do user
            const decoded: {
                id: string;
                name?: string;
                email: string;
                role: Role;
            } = jwtDecode(token);

            console.log("token", decoded);

            const userFromToken = {
                id: decoded.id,
                name: decoded.name ?? decoded.email.split('@')[0],
                email: decoded.email,
                role: decoded.role,
                createdAt: '',
                updatedAt: ''
            };

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: userFromToken,
                    token
                }
            });

            toast.success(`Bem-vindo de volta, ${userFromToken.name}!`);
            navigate('/painel');
        } catch (error: any) {
            console.error("Erro no login:", error);
            const message = error.response?.data?.message || 'Credenciais inválidas';
            dispatch({type: 'LOGIN_FAILURE', payload: message});
            toast.error(message);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            await authAPI.register(name, email, password);

            toast.success('Conta criada com sucesso! Faça login para continuar.');
            navigate('/login'); // 👈 redireciona pro login agora
        } catch (error: any) {
            const message = error.response?.data?.message || 'Falha no registro';
            dispatch({ type: 'REGISTER_FAILURE', payload: message });
            toast.error(message);
        }
    };

    const registerLibrarian = async (name: string, email: string, password: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            await authAPI.registerLibrarian(name, email, password);

            toast.success('Conta de bibliotecário criada com sucesso! Faça login para continuar.');
            navigate('/login'); // 👈 redireciona pro login
        } catch (error: any) {
            const message = error.response?.data?.message || 'Falha no registro do bibliotecário';
            dispatch({ type: 'REGISTER_FAILURE', payload: message });
            toast.error(message);
        }
    };


    // Logout user
    const logout = () => {
        dispatch({type: 'LOGOUT'});
        toast.info('Você foi desconectado');
        navigate('/login');
    };

    // Update user
    const updateUser = (user: User) => {
        dispatch({type: 'UPDATE_USER', payload: user});
    };

    // Clear error
    const clearError = () => {
        dispatch({type: 'CLEAR_ERROR'});
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
