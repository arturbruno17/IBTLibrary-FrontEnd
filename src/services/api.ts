
import axios from 'axios';
import { Book, Loan, User, Role } from '@/types';
import { toast } from "sonner";

// Base API instance
const api = axios.create({
  baseURL: '/api/v1',
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

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
  getAll: async () => {
    const response = await api.get<Book[]>('/books');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },
  create: async (book: Partial<Book>) => {
    const response = await api.post<Book>('/books', book);
    return response.data;
  },
  update: async (id: string, book: Partial<Book>) => {
    const response = await api.put<Book>(`/books/${id}`, book);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  }
};

// Loans API
export const loansAPI = {
  create: async (bookId: string, personId: string) => {
    const response = await api.post<Loan>(`/loan/${bookId}/${personId}`);
    return response.data;
  },
  extend: async (loanId: string) => {
    const response = await api.patch<Loan>(`/loan/${loanId}/extend`);
    return response.data;
  },
  return: async (loanId: string) => {
    const response = await api.patch<Loan>(`/loan/${loanId}/return`);
    return response.data;
  },
  getUserLoans: async (userId: string) => {
    const response = await api.get<Loan[]>(`/people/${userId}/loans`);
    return response.data;
  },
  getAllLoans: async () => {
    const response = await api.get<Loan[]>('/loans');
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get<User[]>('/people');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<User>(`/people/${id}`);
    return response.data;
  },
  update: async (id: string, user: Partial<User>) => {
    const response = await api.put<User>(`/people/${id}`, user);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/people/${id}`);
    return response.data;
  },
  changeRole: async (id: string, role: Role) => {
    const response = await api.patch<User>(`/people/${id}/${role}`);
    return response.data;
  }
};

export default api;
