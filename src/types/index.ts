
// Auth
export enum Role {
    READER = 'READER',
    LIBRARIAN = 'LIBRARIAN',
    ADMIN = 'ADMIN'
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
    id: number;
    name: string;
    role: Role;
    email: string;
}

// Book related interfaces
export interface Book {
    id?: number;
    isbn: string;
    title: string;
    author: string;
    quantity: number;
    available: number;
}

// Loan related interfaces
export enum LoanStatus {
    PENDING = 'pending',
    // ACTIVE = 'active',
    CANCELED = 'canceled',
    EXTENDED = 'extended',
    INDAYS= "IN_DAYS",
    RETURNED = "RETURNED",
    OVERDUE = "OVERDUE",
}

export interface Loan {
    id: number;
    person: User;
    book: Book;
    start_date: string;
    duration: number;
    return_date: string | null;
    type: LoanStatus;
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
