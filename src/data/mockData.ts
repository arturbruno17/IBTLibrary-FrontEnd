
import { Book, Loan, LoanStatus, Role, User } from "@/types";

export const mockBooks: Book[] = [
  {
    id: 1,
    isbn: "9780545010221",
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling",
    quantity: 5,
    available: 3,
    description: "O primeiro livro da série Harry Potter."
  },
  {
    id: 2,
    isbn: "9780618260300",
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    quantity: 3,
    available: 1,
    description: "A primeira parte da trilogia O Senhor dos Anéis."
  },
  {
    id: 3,
    isbn: "9780061120084",
    title: "O Sol é para Todos",
    author: "Harper Lee",
    quantity: 2,
    available: 2,
    description: "Um clássico da literatura americana que aborda questões de racismo e injustiça."
  },
  {
    id: 4,
    isbn: "9780451524935",
    title: "1984",
    author: "George Orwell",
    quantity: 4,
    available: 4,
    description: "Um romance distópico sobre totalitarismo e vigilância governamental."
  },
  {
    id: 5,
    isbn: "9780141439518",
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    quantity: 3,
    available: 2,
    description: "Um romance clássico sobre classes sociais e relacionamentos."
  }
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    role: Role.READER
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@example.com",
    role: Role.READER
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    email: "carlos@example.com",
    role: Role.READER
  },
  {
    id: 4,
    name: "Ana Bibliotecária",
    email: "ana@example.com",
    role: Role.LIBRARIAN
  },
  {
    id: 5,
    name: "Pedro Admin",
    email: "pedro@example.com",
    role: Role.ADMIN
  }
];

export const mockLoans = [
  {
    id: 1,
    bookId: 1,
    userId: 1,
    bookTitle: "Harry Potter e a Pedra Filosofal",
    userName: "João Silva",
    startDate: "2023-05-10",
    dueDate: "2023-05-24",
    status: "active"
  },
  {
    id: 2,
    bookId: 2,
    userId: 2,
    bookTitle: "O Senhor dos Anéis: A Sociedade do Anel",
    userName: "Maria Santos",
    startDate: "2023-05-12",
    dueDate: "2023-05-26",
    status: "overdue"
  },
  {
    id: 3,
    bookId: 3,
    userId: 3,
    bookTitle: "O Sol é para Todos",
    userName: "Carlos Oliveira",
    startDate: "2023-05-15",
    dueDate: "2023-05-29",
    status: "returned",
    returnDate: "2023-05-28"
  }
];
