import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Loan, LoanStatus, Book, User, Role } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  BookCopy,
  CalendarPlus,
  ChevronDown,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { mockBooks, mockUsers } from '@/data/mockData';

const mockLoans: Loan[] = [
  {
    id: '1',
    book: mockBooks[0],
    user: {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: Role.READER,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    loanDate: '2023-06-01T00:00:00Z',
    dueDate: '2023-06-15T00:00:00Z',
    status: LoanStatus.ACTIVE,
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z'
  },
  {
    id: '2',
    book: mockBooks[1],
    user: {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: Role.READER,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    loanDate: '2023-06-05T00:00:00Z',
    dueDate: '2023-06-19T00:00:00Z',
    status: LoanStatus.ACTIVE,
    createdAt: '2023-06-05T00:00:00Z',
    updatedAt: '2023-06-05T00:00:00Z'
  },
  {
    id: '3',
    book: mockBooks[2],
    user: {
      id: '2',
      name: 'Maria Johnson',
      email: 'maria@example.com',
      role: Role.READER,
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z'
    },
    loanDate: '2023-06-02T00:00:00Z',
    dueDate: '2023-06-10T00:00:00Z',
    status: LoanStatus.OVERDUE,
    createdAt: '2023-06-02T00:00:00Z',
    updatedAt: '2023-06-02T00:00:00Z'
  },
  {
    id: '4',
    book: mockBooks[3],
    user: {
      id: '3',
      name: 'David Brown',
      email: 'david@example.com',
      role: Role.READER,
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: '2023-01-03T00:00:00Z'
    },
    loanDate: '2023-05-25T00:00:00Z',
    dueDate: '2023-06-08T00:00:00Z',
    status: LoanStatus.RETURNED,
    returnDate: '2023-06-07T00:00:00Z',
    createdAt: '2023-05-25T00:00:00Z',
    updatedAt: '2023-06-07T00:00:00Z'
  },
  {
    id: '5',
    book: mockBooks[4],
    user: {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: Role.READER,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    loanDate: '2023-05-15T00:00:00Z',
    dueDate: '2023-05-29T00:00:00Z',
    status: LoanStatus.EXTENDED,
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-05-28T00:00:00Z'
  }
];

type LoanFilter = 'all' | 'active' | 'returned' | 'overdue' | 'extended';

const Loans = () => {
  const { user, hasRole } = useAuth();
  const isLibrarianOrAdmin = hasRole([Role.LIBRARIAN, Role.ADMIN]);
  
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<LoanFilter>('all');
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  
  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [creatingLoan, setCreatingLoan] = useState(false);
  
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadLoans = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isLibrarianOrAdmin) {
        setLoans(mockLoans);
      } else {
        const userLoans = mockLoans.filter(loan => loan.user.id === user?.id);
        setLoans(userLoans);
      }
      
      setLoading(false);
    };
    
    loadLoans();
  }, [isLibrarianOrAdmin, user?.id]);
  
  // Update available books and users when the loan dialog opens
  useEffect(() => {
    if (showLoanDialog) {
      // Only show books with available copies
      const books = mockBooks.filter(book => book.availableQuantity > 0);
      setAvailableBooks(books);
      
      // Only show reader users
      const readers = mockUsers.filter(user => user.role === Role.READER);
      setAvailableUsers(readers);
      
      console.log('Available books for loans:', books);
      console.log('Available users for loans:', readers);
    }
  }, [showLoanDialog]);
  
  useEffect(() => {
    let result = [...loans];
    
    if (filter !== 'all') {
      result = result.filter(loan => loan.status === filter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        loan =>
          loan.book.title.toLowerCase().includes(query) ||
          loan.book.author.toLowerCase().includes(query) ||
          loan.user.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredLoans(result);
  }, [loans, filter, searchQuery]);
  
  const handleCreateLoan = async () => {
    if (!selectedBook || !selectedUser) {
      toast.error('Please select both a book and a user');
      return;
    }
    
    setCreatingLoan(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const book = mockBooks.find(b => b.id === selectedBook);
    const reader = mockUsers.find(u => u.id === selectedUser);
    
    if (book && reader) {
      // Create a single loan
      const newLoan: Loan = {
        id: `loan-${Date.now()}`,
        book,
        user: reader,
        loanDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: LoanStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update book availability
      const bookIndex = mockBooks.findIndex(b => b.id === book.id);
      if (bookIndex >= 0) {
        mockBooks[bookIndex] = {
          ...mockBooks[bookIndex],
          availableQuantity: mockBooks[bookIndex].availableQuantity - 1
        };
      }
      
      // Update the loans array in memory
      mockLoans.unshift(newLoan);
      setLoans(prevLoans => [newLoan, ...prevLoans]);
      
      toast.success(`Book "${book.title}" loaned to ${reader.name}`);
      setShowLoanDialog(false);
      setSelectedBook('');
      setSelectedUser('');
    } else {
      toast.error('Error creating loan. Book or user not found.');
    }
    
    setCreatingLoan(false);
  };
  
  const handleReturnBook = async (loanId: string) => {
    setProcessingLoanId(loanId);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const loanIndex = loans.findIndex(l => l.id === loanId);
    if (loanIndex >= 0) {
      const loan = loans[loanIndex];
      
      const updatedLoan = {
        ...loan,
        status: LoanStatus.RETURNED,
        returnDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const bookIndex = mockBooks.findIndex(b => b.id === loan.book.id);
      if (bookIndex >= 0) {
        mockBooks[bookIndex] = {
          ...mockBooks[bookIndex],
          availableQuantity: mockBooks[bookIndex].availableQuantity + 1
        };
      }
      
      const updatedLoans = [...loans];
      updatedLoans[loanIndex] = updatedLoan;
      setLoans(updatedLoans);
      
      const mockLoanIndex = mockLoans.findIndex(l => l.id === loanId);
      if (mockLoanIndex >= 0) {
        mockLoans[mockLoanIndex] = updatedLoan;
      }
      
      toast.success(`Book "${loan.book.title}" has been returned`);
    }
    
    setProcessingLoanId(null);
  };
  
  const handleExtendLoan = async (loanId: string) => {
    setProcessingLoanId(loanId);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLoans(prev => 
      prev.map(loan => {
        if (loan.id === loanId) {
          const currentDueDate = new Date(loan.dueDate);
          const newDueDate = new Date(currentDueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
          
          const updatedLoan = {
            ...loan,
            status: LoanStatus.EXTENDED,
            dueDate: newDueDate.toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const mockLoanIndex = mockLoans.findIndex(l => l.id === loanId);
          if (mockLoanIndex >= 0) {
            mockLoans[mockLoanIndex] = updatedLoan;
          }
          
          return updatedLoan;
        }
        return loan;
      })
    );
    
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      toast.success(`Loan for "${loan.book.title}" has been extended by 14 days`);
    }
    
    setProcessingLoanId(null);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).getTime() > 0;
  };
  
  const getLoanStatusBadge = (loan: Loan) => {
    const isDue = isOverdue(loan.dueDate);
    
    if (loan.status === LoanStatus.RETURNED) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Returned
        </Badge>
      );
    }
    
    if (loan.status === LoanStatus.OVERDUE || (loan.status === LoanStatus.ACTIVE && isDue)) {
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/20">
          <XCircle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    
    if (loan.status === LoanStatus.EXTENDED) {
      return (
        <Badge variant="outline" className="bg-orange-500/10 text-orange-700 hover:bg-orange-500/20">
          <CalendarPlus className="h-3 w-3 mr-1" />
          Extended
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20">
        <BookCopy className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1>{isLibrarianOrAdmin ? 'Loan Management' : 'My Loans'}</h1>
            <p className="text-muted-foreground">
              {isLibrarianOrAdmin 
                ? 'Manage book loans and returns'
                : 'Track your borrowed books and due dates'}
            </p>
          </div>
          
          {isLibrarianOrAdmin && (
            <Button onClick={() => setShowLoanDialog(true)}>
              <BookCopy className="h-4 w-4 mr-2" />
              Issue New Loan
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${isLibrarianOrAdmin ? 'books or users' : 'your loans'}...`}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'all'} />
                    <span>All Loans</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('active')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'active'} />
                    <span>Active</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('returned')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'returned'} />
                    <span>Returned</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('overdue')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'overdue'} />
                    <span>Overdue</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('extended')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'extended'} />
                    <span>Extended</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading loans...</p>
          </div>
        ) : (
          <>
            {filteredLoans.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Book</th>
                        {isLibrarianOrAdmin && (
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                        )}
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Loan Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredLoans.map((loan) => (
                        <tr key={loan.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-8 rounded overflow-hidden flex-shrink-0">
                                {loan.book.cover ? (
                                  <img 
                                    src={loan.book.cover} 
                                    alt={loan.book.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-muted flex items-center justify-center">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <Link 
                                  to={`/books/${loan.book.id}`} 
                                  className="font-medium text-sm hover:underline"
                                >
                                  {loan.book.title}
                                </Link>
                                <div className="text-xs text-muted-foreground">{loan.book.author}</div>
                              </div>
                            </div>
                          </td>
                          
                          {isLibrarianOrAdmin && (
                            <td className="px-4 py-3 text-sm">
                              <div className="font-medium">{loan.user.name}</div>
                              <div className="text-xs text-muted-foreground">{loan.user.email}</div>
                            </td>
                          )}
                          
                          <td className="px-4 py-3 text-sm">
                            {formatDate(loan.loanDate)}
                          </td>
                          
                          <td className="px-4 py-3 text-sm">
                            <span className={isOverdue(loan.dueDate) && loan.status !== 'returned' ? 'text-destructive' : ''}>
                              {formatDate(loan.dueDate)}
                            </span>
                          </td>
                          
                          <td className="px-4 py-3 text-sm">
                            {getLoanStatusBadge(loan)}
                          </td>
                          
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end space-x-2">
                              {loan.status === LoanStatus.ACTIVE && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExtendLoan(loan.id)}
                                    disabled={processingLoanId === loan.id}
                                  >
                                    {processingLoanId === loan.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <CalendarPlus className="h-3 w-3" />
                                    )}
                                    <span className="ml-1 hidden sm:inline">Extend</span>
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    onClick={() => handleReturnBook(loan.id)}
                                    disabled={processingLoanId === loan.id}
                                  >
                                    {processingLoanId === loan.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-3 w-3" />
                                    )}
                                    <span className="ml-1 hidden sm:inline">Return</span>
                                  </Button>
                                </>
                              )}
                              
                              {loan.status === LoanStatus.OVERDUE && (
                                <Button
                                  size="sm"
                                  onClick={() => handleReturnBook(loan.id)}
                                  disabled={processingLoanId === loan.id}
                                >
                                  {processingLoanId === loan.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-3 w-3" />
                                  )}
                                  <span className="ml-1 hidden sm:inline">Return</span>
                                </Button>
                              )}
                              
                              {loan.status === LoanStatus.EXTENDED && (
                                <Button
                                  size="sm"
                                  onClick={() => handleReturnBook(loan.id)}
                                  disabled={processingLoanId === loan.id}
                                >
                                  {processingLoanId === loan.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-3 w-3" />
                                  )}
                                  <span className="ml-1 hidden sm:inline">Return</span>
                                </Button>
                              )}
                              
                              {loan.status === LoanStatus.RETURNED && (
                                <span className="text-xs text-muted-foreground px-2">
                                  {loan.returnDate ? `Returned on ${formatDate(loan.returnDate)}` : 'Returned'}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <BookCopy className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No loans found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : isLibrarianOrAdmin
                    ? 'No loans have been issued yet'
                    : "You don't have any active loans"}
                </p>
                {searchQuery || filter !== 'all' ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setFilter('all');
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                ) : isLibrarianOrAdmin ? (
                  <Button onClick={() => setShowLoanDialog(true)}>
                    <BookCopy className="h-4 w-4 mr-2" />
                    Issue New Loan
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/catalog">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Catalog
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      <Dialog open={showLoanDialog} onOpenChange={setShowLoanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue New Loan</DialogTitle>
            <DialogDescription>
              Select a book and a user to create a new loan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="book">Book</Label>
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger id="book">
                  <SelectValue placeholder="Select a book" />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.length > 0 ? (
                    availableBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} by {book.author} ({book.availableQuantity} available)
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No books available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-start space-x-2 text-sm">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Books are loaned for a standard period of 14 days.
              </span>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowLoanDialog(false)}
              disabled={creatingLoan}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateLoan}
              disabled={!selectedBook || !selectedUser || creatingLoan}
            >
              {creatingLoan ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <BookCopy className="h-4 w-4 mr-2" />
                  Create Loan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Loans;

