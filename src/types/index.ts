
// Enumerations
export enum Role {
  READER = "reader",
  LIBRARIAN = "librarian",
  ADMIN = "admin"
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
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
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
