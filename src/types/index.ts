
// Enumerations
export enum Role {
  READER = "reader",
  LIBRARIAN = "librarian",
  ADMIN = "admin"
}

export enum LoanStatus {
  ACTIVE = "active",
  RETURNED = "returned",
  OVERDUE = "overdue",
  EXTENDED = "extended"
}

// Auth interfaces
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
}

// Book interfaces
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishedYear?: number;
  description?: string;
  cover?: string;
  quantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

// User interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Loan interfaces
export interface Loan {
  id: string;
  book: Book;
  user: User;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

// OpenLibrary API types
export interface OpenLibraryAuthor {
  key: string;
  name: string;
}

export interface OpenLibraryBook {
  key?: string;
  title: string;
  author_name?: string[];
  authors?: OpenLibraryAuthor[];
  isbn?: string[];
  publisher?: string[];
  publish_date?: string;
  cover_i?: number;
  description?: string;
}

export interface OpenLibraryResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}
