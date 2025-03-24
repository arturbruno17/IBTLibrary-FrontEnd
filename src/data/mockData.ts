
import { Book, User, Role } from '@/types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    publisher: 'Scribner',
    publishedYear: 1925,
    description: 'A story of wealth, love, and tragedy set in the Roaring Twenties.',
    cover: 'https://covers.openlibrary.org/b/id/8432047-M.jpg',
    quantity: 3,
    availableQuantity: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    publisher: 'HarperCollins',
    publishedYear: 1960,
    description: 'A novel about racial injustice and moral growth in the American South.',
    cover: 'https://covers.openlibrary.org/b/id/8810494-M.jpg',
    quantity: 5,
    availableQuantity: 3,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    publisher: 'Signet Classics',
    publishedYear: 1949,
    description: 'A dystopian novel about totalitarianism, surveillance, and thought control.',
    cover: 'https://covers.openlibrary.org/b/id/8575141-M.jpg',
    quantity: 4,
    availableQuantity: 2,
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    publisher: 'Penguin Classics',
    publishedYear: 1813,
    description: 'A romantic novel of manners that satirizes issues of marriage, social class, and prejudice.',
    cover: 'https://covers.openlibrary.org/b/id/8479576-M.jpg',
    quantity: 3,
    availableQuantity: 0,
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z'
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780316769488',
    publisher: 'Little, Brown and Company',
    publishedYear: 1951,
    description: 'A novel about teenage alienation and the loss of innocence.',
    cover: 'https://covers.openlibrary.org/b/id/8231432-M.jpg',
    quantity: 2,
    availableQuantity: 1,
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: Role.READER,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Maria Johnson',
    email: 'maria@example.com',
    role: Role.READER,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'David Brown',
    email: 'david@example.com',
    role: Role.READER,
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Library Admin',
    email: 'admin@library.com',
    role: Role.ADMIN,
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Librarian Staff',
    email: 'staff@library.com',
    role: Role.LIBRARIAN,
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z'
  }
];
