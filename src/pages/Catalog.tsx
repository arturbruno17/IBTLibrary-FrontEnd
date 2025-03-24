
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BookCard from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, BookOpen } from 'lucide-react';
import { Book } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { mockBooks } from '@/data/mockData';

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
