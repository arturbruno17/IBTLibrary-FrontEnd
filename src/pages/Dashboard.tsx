
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, BookCopy, BookOpen, CheckSquare, Clock, UserRound, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock data for demo
const mockStats = {
  totalBooks: 387,
  availableBooks: 285,
  activeLoans: 102,
  overdue: 14,
  readers: 156,
  popularCategories: [
    { name: 'Fiction', count: 120 },
    { name: 'Science', count: 87 },
    { name: 'History', count: 65 },
    { name: 'Biography', count: 52 }
  ]
};

const mockRecentBooks = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: 'https://covers.openlibrary.org/b/id/8432047-M.jpg' },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: 'https://covers.openlibrary.org/b/id/8810494-M.jpg' },
  { id: '3', title: '1984', author: 'George Orwell', cover: 'https://covers.openlibrary.org/b/id/8575141-M.jpg' },
  { id: '4', title: 'The Catcher in the Rye', author: 'J.D. Salinger', cover: 'https://covers.openlibrary.org/b/id/8231432-M.jpg' }
];

const mockLoans = [
  { id: '1', bookTitle: 'The Great Gatsby', dueDate: '2023-06-15', status: 'active' },
  { id: '2', bookTitle: 'To Kill a Mockingbird', dueDate: '2023-06-22', status: 'active' },
  { id: '3', bookTitle: 'Pride and Prejudice', dueDate: '2023-06-10', status: 'overdue' }
];

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const isLibrarian = hasRole(['librarian', 'admin']);
  
  const handleQuickAction = (action: string) => {
    toast.success(`${action} action initiated successfully!`);
  };
  
  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1>Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">
              {isLibrarian 
                ? 'Manage your library resources and assist readers'
                : 'Explore books and manage your loans'}
            </p>
          </div>
          
          {isLibrarian && (
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/add-book">
                  <Book className="h-4 w-4 mr-2" />
                  Add New Book
                </Link>
              </Button>
              <Button variant="outline" onClick={() => handleQuickAction('Manage loans')}>
                <BookCopy className="h-4 w-4 mr-2" />
                Manage Loans
              </Button>
            </div>
          )}
        </div>
        
        {/* Stats overview */}
        {isLibrarian && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Books</p>
                  <h3 className="text-3xl font-bold mt-1">{mockStats.totalBooks}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
                  <h3 className="text-3xl font-bold mt-1">{mockStats.activeLoans}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookCopy className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Readers</p>
                  <h3 className="text-3xl font-bold mt-1">{mockStats.readers}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <h3 className="text-3xl font-bold mt-1">{mockStats.overdue}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Reader's content */}
        {!isLibrarian && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookCopy className="h-5 w-5 mr-2" />
                  My Loans
                </CardTitle>
                <CardDescription>Books you've currently borrowed</CardDescription>
              </CardHeader>
              <CardContent>
                {mockLoans.length > 0 ? (
                  <ul className="space-y-3">
                    {mockLoans.map(loan => (
                      <li key={loan.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${loan.status === 'overdue' ? 'bg-destructive' : 'bg-primary'}`}></div>
                          <span className="font-medium">{loan.bookTitle}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm ${loan.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`}>
                            Due: {new Date(loan.dueDate).toLocaleDateString()}
                          </span>
                          <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleQuickAction('Renew')}>
                            Renew
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>You don't have any active loans</p>
                    <Button variant="outline" className="mt-3" asChild>
                      <Link to="/catalog">Browse Books</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  Reading Recommendations
                </CardTitle>
                <CardDescription>Books you might enjoy based on your history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {mockRecentBooks.map(book => (
                    <Link 
                      to={`/books/${book.id}`} 
                      key={book.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="h-16 w-12 object-cover rounded-sm shadow-sm"
                      />
                      <div className="min-w-0">
                        <p className="font-medium truncate text-sm">{book.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Librarian's content */}
        {isLibrarian && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest book loans and returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {i % 2 === 0 ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <BookCopy className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {i % 2 === 0 ? 'Book returned' : 'Book borrowed'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {i % 2 === 0 
                            ? `"${mockRecentBooks[i % 4].title}" was returned by Maria Johnson`
                            : `"${mockRecentBooks[i % 4].title}" was borrowed by John Smith`
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(2023, 5, 20 - i).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Most borrowed book categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStats.popularCategories.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">{category.count} books</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(category.count / mockStats.popularCategories[0].count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Quick actions */}
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button variant="outline" className="flex flex-col h-auto py-4" asChild>
                <Link to="/catalog">
                  <BookOpen className="h-5 w-5 mb-2" />
                  <span className="text-sm">Browse Books</span>
                </Link>
              </Button>
              
              {isLibrarian ? (
                <>
                  <Button variant="outline" className="flex flex-col h-auto py-4" asChild>
                    <Link to="/add-book">
                      <Book className="h-5 w-5 mb-2" />
                      <span className="text-sm">Add Book</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleQuickAction('Process Returns')}>
                    <CheckSquare className="h-5 w-5 mb-2" />
                    <span className="text-sm">Process Returns</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleQuickAction('Overdue Notices')}>
                    <Clock className="h-5 w-5 mb-2" />
                    <span className="text-sm">Overdue Notices</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4" asChild>
                    <Link to="/users">
                      <Users className="h-5 w-5 mb-2" />
                      <span className="text-sm">Manage Users</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex flex-col h-auto py-4" asChild>
                    <Link to="/loans">
                      <BookCopy className="h-5 w-5 mb-2" />
                      <span className="text-sm">My Loans</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleQuickAction('Reading History')}>
                    <UserRound className="h-5 w-5 mb-2" />
                    <span className="text-sm">Reading History</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
