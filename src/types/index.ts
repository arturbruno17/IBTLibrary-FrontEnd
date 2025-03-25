
// Auth
export enum Role {
  READER = 'reader',
  LIBRARIAN = 'librarian',
  ADMIN = 'admin'
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Book related interfaces
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishedYear?: number;
  description?: string;
  quantity: number;
  availableQuantity: number;
  addedBy?: string;
  addedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Loan related interfaces
export enum LoanStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  OVERDUE = 'overdue',
  RETURNED = 'returned',
  CANCELED = 'canceled',
  EXTENDED = 'extended'
}

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  book: Book;
  user: User;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
  createdAt?: string;
  updatedAt?: string;
}

// OpenLibrary API response interfaces
export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  authors?: { name: string }[];
  isbn?: string[];
  publisher?: string[];
  publish_date?: string;
  description?: string;
}

export interface OpenLibraryResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}
