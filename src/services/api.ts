
import axios from 'axios';
import { Book, Loan, User, Role, LoanStatus, SummaryResponse, RecentActivityResponse } from '@/types';
import { toast } from "sonner";

let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (cb: () => void) => {
    logoutCallback = cb;
};

export const handleUnauthorized = () => {
    if (logoutCallback) {
        logoutCallback();
    } else {
        console.warn("Logout automático não foi configurado corretamente.");
    }
};

// Base API instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);



api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Ocorreu um erro';

        if (status === 401) {
            toast.info("Sua sessão expirou. Faça login novamente.");
            handleUnauthorized(); // 🔥 chama logout registrado
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

// Handle response errors
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const message = error.response?.data?.message || 'An error occurred';
//         toast.error(message);
//         return Promise.reject(error);
//     }
// );

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },
    registerLibrarian: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register/librarian', { name, email, password });
        return response.data;
    }
};

// Books API
export const booksAPI = {
    getAll: async (page = 0, limit = 12, query = "") => {
        const response = await api.get<Book[]>('/books', {
            params: {
                page: page + 1,
                limit,
                q: query
            }
        });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Book>(`/books/${id}`);
        return response.data;
    },
    create: async (book: Partial<Book>) => {
        const response = await api.post<Book>('/books', book);
        // Add a success toast when book is created
        toast.success(`Book "${book.title}" added successfully`);
        return response.data;
    },
    update: async (id: number, book: Partial<Book>) => {
        const response = await api.put<Book>(`/books/${id}`, book);
        // Add a success toast when book is updated
        toast.success(`Book "${book.title}" updated successfully`);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/books/${id}`);
        toast.success('Book deleted successfully');
        return response.data;
    }
};

// Loans API
export const loansAPI = {
    create: async (bookId: string, personId: string,) => {
        const response = await api.post<Loan>(`/loan/${bookId}/${personId}`);
        return response.data;
    },
    extend: async (loanId: number) => {
        const response = await api.patch<Loan>(`/loan/${loanId}/extend`);
        return response.data;
    },
    return: async (loanId: number) => {
        const response = await api.patch<Loan>(`/loan/${loanId}/return`);
        return response.data;
    },
    getUserLoans: async (userId: string) => {
        const response = await api.get<Loan[]>(`/people/${userId}/loans`);
        return response.data;
    },
    getAllLoans: async ({
        page = 0,
        limit = 10,
        person_id,
        book_id,
        types,
    }: {
        page?: number;
        limit?: number;
        person_id?: number;
        book_id?: number;
        types?: LoanStatus;
    }) => {
        const response = await api.get<Loan[]>('/loan', {
            params: {
                page: page + 1,
                limit,
                person_id,
                book_id,
                types,
            },
        });
        return response.data;
    },

    getActivity: async (params: { maximum_date: string; page: number; limit: number }): Promise<RecentActivityResponse[]> => {
        const response = await api.get('/loan/activity', { params });
        return response.data;
    },
};

// Users API
export const usersAPI = {

    getAll: async (page = 0, limit = 12, query = "", roles: Role) => {
        const params: Record<string, any> = {
            page: page + 1,
            limit,
            roles,
        };
        if (query.trim() !== "") {
            params.q = query.trim();
        }

        const response = await api.get<User[]>("/people", { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<User>(`/people/${id}`);
        return response.data;
    },
    getLoanByUser: async (id: number): Promise<Loan[]> => {
        const response = await api.get(`/people/${id}/loans`);
        return response.data;
    },
    update: async (id: string, user: Partial<User>) => {
        const response = await api.put<User>(`/people/${id}`, user);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/people/${id}`);
        return response.data;
    },
    changeRole: async (id: number, role: Role) => {
        const response = await api.patch<User>(`/people/${id}/${role}`);
        return response.data;
    },
};

export const summaryAPI = {
    getAll: async (): Promise<SummaryResponse> => {
        const response = await api.get('/summary');
        return response.data;
    },
};

export default api;
