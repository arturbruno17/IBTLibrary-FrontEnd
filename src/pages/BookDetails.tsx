
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Book, Role } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Pencil,
  Trash2,
  BookCopy,
  ArrowLeft,
  CheckCircle,
  BookOpen,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Use the same mock data as in Catalog
const mockBooks: Book[] = [
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

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { hasRole, user } = useAuth();
  const navigate = useNavigate();
  const isLibrarianOrAdmin = hasRole(['librarian', 'admin'] as Role[]);
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundBook = mockBooks.find(book => book.id === id);
      setBook(foundBook || null);
      setLoading(false);
    };
    
    fetchBook();
  }, [id]);
  
  // Handle borrow action
  const handleBorrow = async () => {
    if (!book || !user) return;
    
    setBorrowing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Successfully borrowed "${book.title}"`);
    setBook(prev => prev ? { ...prev, availableQuantity: prev.availableQuantity - 1 } : null);
    
    setBorrowing(false);
  };
  
  // Handle delete action
  const handleDelete = async () => {
    if (!book) return;
    
    setDeleting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Book "${book.title}" has been deleted`);
    
    setDeleting(false);
    navigate('/catalog');
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading book details...</p>
        </div>
      </Layout>
    );
  }
  
  if (!book) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Catalog
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const isAvailable = book.availableQuantity > 0;
  
  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Catalog
            </Link>
          </Button>
        </div>
        
        {/* Book details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book cover */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg overflow-hidden border shadow-md">
              {book.cover ? (
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="aspect-[2/3] w-full flex items-center justify-center bg-muted">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              
              {/* Availability badge */}
              <div className="p-4">
                <Badge 
                  className={`w-full justify-center py-1 px-2 ${
                    isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-destructive hover:bg-destructive/90'
                  }`}
                >
                  {isAvailable ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available ({book.availableQuantity} of {book.quantity})
                    </span>
                  ) : (
                    <span>Currently Unavailable</span>
                  )}
                </Badge>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mt-4 flex flex-col gap-2">
              {isLibrarianOrAdmin ? (
                <>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/edit-book/${book.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Book
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Book
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the book
                          "{book.title}" and all associated loan records.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={handleDelete}
                          disabled={deleting}
                        >
                          {deleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  <Button 
                    className="w-full justify-start" 
                    disabled={!isAvailable || borrowing}
                    onClick={handleBorrow}
                  >
                    <BookCopy className="h-4 w-4 mr-2" />
                    {borrowing ? 'Processing...' : 'Borrow Book'}
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Book information */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <h2 className="text-xl text-muted-foreground mb-4">by {book.author}</h2>
            
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{book.description || 'No description available.'}</p>
              </div>
              
              <Separator />
              
              {/* Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Details</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium">ISBN</dt>
                  <dd className="text-muted-foreground">{book.isbn}</dd>
                  
                  <dt className="font-medium">Publisher</dt>
                  <dd className="text-muted-foreground">{book.publisher || 'Unknown'}</dd>
                  
                  <dt className="font-medium">Published Year</dt>
                  <dd className="text-muted-foreground">{book.publishedYear || 'Unknown'}</dd>
                  
                  <dt className="font-medium">Total Copies</dt>
                  <dd className="text-muted-foreground">{book.quantity}</dd>
                  
                  <dt className="font-medium">Available Copies</dt>
                  <dd className={`${isAvailable ? 'text-green-600' : 'text-destructive'} font-medium`}>
                    {book.availableQuantity}
                  </dd>
                </dl>
              </div>
              
              <Separator />
              
              {/* Loan history (for librarians only) */}
              {isLibrarianOrAdmin && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Loan History</h3>
                  
                  <div className="border rounded-md">
                    <div className="p-4 text-center text-muted-foreground">
                      <p>Recent loan records will appear here.</p>
                      <p className="text-sm">No loan records found for this book.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
