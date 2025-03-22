
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Book as BookType, Role } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Check,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard from '@/components/BookCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for books
const mockBooks: BookType[] = [
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

// Filters and sorting
type SortOption = 'title_asc' | 'title_desc' | 'author_asc' | 'author_desc' | 'year_asc' | 'year_desc';
type FilterOption = 'available' | 'all';

const Catalog = () => {
  const { hasRole } = useAuth();
  const isLibrarianOrAdmin = hasRole(['librarian', 'admin'] as Role[]);
  const isMobile = useIsMobile();
  
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('title_asc');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  
  // Simulate loading books from API
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setLoading(false);
    };
    
    loadBooks();
  }, []);
  
  // Filter and sort books
  useEffect(() => {
    let result = [...books];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) ||
          book.isbn.includes(query)
      );
    }
    
    // Apply availability filter
    if (filterOption === 'available') {
      result = result.filter(book => book.availableQuantity > 0);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'author_asc':
          return a.author.localeCompare(b.author);
        case 'author_desc':
          return b.author.localeCompare(a.author);
        case 'year_asc':
          return (a.publishedYear || 0) - (b.publishedYear || 0);
        case 'year_desc':
          return (b.publishedYear || 0) - (a.publishedYear || 0);
        default:
          return 0;
      }
    });
    
    setFilteredBooks(result);
  }, [books, searchQuery, sortOption, filterOption]);
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1>Book Catalog</h1>
            <p className="text-muted-foreground">
              Browse our collection of books
            </p>
          </div>
          
          {isLibrarianOrAdmin && (
            <Button asChild>
              <Link to="/add-book">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Book
              </Link>
            </Button>
          )}
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or ISBN..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex gap-2">
            {/* Availability filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {!isMobile && 'Filter'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Availability</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilterOption('all')}>
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={filterOption === 'all'} />
                      <span>All Books</span>
                    </div>
                    {filterOption === 'all' && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterOption('available')}>
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={filterOption === 'available'} />
                      <span>Available Only</span>
                    </div>
                    {filterOption === 'available' && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Sort options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {sortOption.includes('asc') ? (
                    <SortAsc className="h-4 w-4 mr-2" />
                  ) : (
                    <SortDesc className="h-4 w-4 mr-2" />
                  )}
                  {!isMobile && 'Sort'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSortOption('title_asc')}>
                    Title (A-Z)
                    {sortOption === 'title_asc' && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('title_desc')}>
                    Title (Z-A)
                    {sortOption === 'title_desc' && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOption('author_asc')}>
                    Author (A-Z)
                    {sortOption === 'author_asc' && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('author_desc')}>
                    Author (Z-A)
                    {sortOption === 'author_desc' && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOption('year_asc')}>
                    Year (Oldest first)
                    {sortOption === 'year_asc' && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('year_desc')}>
                    Year (Newest first)
                    {sortOption === 'year_desc' && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        ) : (
          <>
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                {filteredBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No books found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setFilterOption('all');
                  setSortOption('title_asc');
                }}>
                  Clear all filters
                </Button>
              </div>
            )}
            
            {/* Results summary */}
            {filteredBooks.length > 0 && (
              <div className="text-sm text-muted-foreground text-center mt-6">
                Showing {filteredBooks.length} of {books.length} books
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Catalog;
