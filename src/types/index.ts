
export type Role = 'reader' | 'librarian' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

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

export interface OpenLibraryBook {
  title: string;
  authors?: { name: string }[];
  publishers?: string[];
  publish_date?: string;
  cover_i?: number;
  isbn?: string[];
  description?: string;
  number_of_pages?: number;
}

export interface OpenLibraryResponse {
  docs: OpenLibraryBook[];
  numFound: number;
}

export enum LoanStatus {
  ACTIVE = 'active',
  RETURNED = 'returned',
  EXTENDED = 'extended',
  OVERDUE = 'overdue'
}

export interface Loan {
  id: string;
  bookId: string;
  book: Book;
  userId: string;
  user: User;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}
