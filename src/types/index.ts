
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
    CANCELED = 'canceled',
    EXTENDED = 'extended',
    IN_DAYS = "IN_DAYS",
    RETURNED = "RETURNED",
    OVERDUE = "OVERDUE",
}

export enum RecentActivityTypeEnum {
    LOAN_CREATED = 'LOAN_CREATED',
    LOAN_RETURNED = 'LOAN_RETURNED',
    LOAN_EXTENDED = 'LOAN_EXTENDED',
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

export interface SummaryResponse {
    total_books: number;
    active_loans_count: number;
    readers_count: number;
    overdue_loans_count: number;
}

export interface RecentActivityResponse {
    id: number;
    loan: Loan;
    activity: RecentActivityTypeEnum;
    created_at: string;
}
