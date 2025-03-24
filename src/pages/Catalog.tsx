
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BookCard from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, BookOpen } from 'lucide-react';
import { Book } from '@/types';
import { useAuth } from '@/context/AuthContext';

// Mock data (will be replaced with real API calls)
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
  },
  {
    id: '6',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928227',
    publisher: 'Houghton Mifflin Harcourt',
    publishedYear: 1937,
    description: 'A fantasy novel about a hobbit who embarks on an adventure.',
    cover: 'https://covers.openlibrary.org/b/id/8323742-M.jpg',
    quantity: 4,
    availableQuantity: 4,
    createdAt: '2023-01-06T00:00:00Z',
    updatedAt: '2023-01-06T00:00:00Z'
  },
  {
    id: '7',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    isbn: '9780747532743',
    publisher: 'Bloomsbury',
    publishedYear: 1997,
    description: 'The first novel in the Harry Potter series, featuring a young wizard\'s adventures at Hogwarts School of Witchcraft and Wizardry.',
    cover: 'https://covers.openlibrary.org/b/id/10110415-M.jpg',
    quantity: 6,
    availableQuantity: 3,
    createdAt: '2023-01-07T00:00:00Z',
    updatedAt: '2023-01-07T00:00:00Z'
  },
  {
    id: '8',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    isbn: '9780618640157',
    publisher: 'Houghton Mifflin Harcourt',
    publishedYear: 1954,
    description: 'An epic fantasy novel about a quest to destroy a powerful ring.',
    cover: 'https://covers.openlibrary.org/b/id/8405716-M.jpg',
    quantity: 3,
    availableQuantity: 1,
    createdAt: '2023-01-08T00:00:00Z',
    updatedAt: '2023-01-08T00:00:00Z'
  }
];

const Catalog = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  
  // Load books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setLoading(false);
    };
    
    fetchBooks();
  }, []);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredBooks(books);
      return;
    }
    
    const results = books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.includes(query)
    );
    
    setFilteredBooks(results);
  };
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1>Book Catalog</h1>
          
          {hasRole(['librarian', 'admin']) && (
            <Button onClick={() => navigate('/add-book')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          )}
        </div>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search books by title, author or ISBN..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="border rounded-lg p-4 h-[320px] animate-pulse flex flex-col items-center"
              >
                <div className="w-full h-44 bg-slate-200 rounded-md mb-3" />
                <div className="w-3/4 h-4 bg-slate-200 rounded mb-2" />
                <div className="w-1/2 h-3 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-xl font-medium mb-2">No books found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No books matching "${searchQuery}"`
                : "The library catalog is empty"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Catalog;
