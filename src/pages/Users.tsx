
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { User, Role } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Search,
  Filter,
  UserPlus,
  Shield,
  ChevronDown,
  Trash2,
  Settings,
  Check,
  BookCopy
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
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

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'reader' as Role,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Maria Johnson',
    email: 'maria@example.com',
    role: 'reader' as Role,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'reader' as Role,
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'librarian' as Role,
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Michael Moore',
    email: 'michael@example.com',
    role: 'admin' as Role,
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z'
  }
];

type UserFilter = 'all' | 'reader' | 'librarian' | 'admin';

const Users = () => {
  const { user } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<UserFilter>('all');
  
  // Dialog states
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<Role>('reader');
  
  // Form data for new user
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'reader' as Role
  });
  
  // Action states
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Exclude current user from the list
      const filteredUsers = mockUsers.filter(u => u.id !== user?.id);
      setUsers(filteredUsers);
      
      setLoading(false);
    };
    
    loadUsers();
  }, [user?.id]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply role filter
    if (filter !== 'all') {
      result = result.filter(user => user.role === filter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(result);
  }, [users, filter, searchQuery]);
  
  // Handle adding a new user
  const handleAddUser = async () => {
    const { name, email, password, role } = newUserData;
    
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate new user
    const newUser: User = {
      id: `new-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    
    toast.success(`User "${name}" added successfully`);
    
    // Reset form and close dialog
    setNewUserData({
      name: '',
      email: '',
      password: '',
      role: 'reader'
    });
    setShowAddUserDialog(false);
    setIsProcessing(false);
  };
  
  // Handle changing user role
  const handleChangeRole = async () => {
    if (!selectedUserId || !newRole) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update user in state
    setUsers(prev => 
      prev.map(user => 
        user.id === selectedUserId
          ? { ...user, role: newRole, updatedAt: new Date().toISOString() }
          : user
      )
    );
    
    const selectedUser = users.find(u => u.id === selectedUserId);
    if (selectedUser) {
      toast.success(`${selectedUser.name}'s role updated to ${newRole}`);
    }
    
    setShowChangeRoleDialog(false);
    setIsProcessing(false);
  };
  
  // Handle deleting a user
  const handleDeleteUser = async (userId: string) => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Remove user from state
    const userToDelete = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    if (userToDelete) {
      toast.success(`User "${userToDelete.name}" deleted successfully`);
    }
    
    setIsProcessing(false);
  };
  
  // Get role badge for a user
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'librarian':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            <BookCopy className="h-3 w-3 mr-1" />
            Librarian
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20">
            Reader
          </Badge>
        );
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1>User Management</h1>
            <p className="text-muted-foreground">
              Manage users and their roles
            </p>
          </div>
          
          <Button onClick={() => setShowAddUserDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
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
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'all'} />
                    <span>All Users</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('reader')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'reader'} />
                    <span>Readers</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('librarian')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'librarian'} />
                    <span>Librarians</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('admin')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'admin'} />
                    <span>Admins</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Users list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <>
            {filteredUsers.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Member Since</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3 text-sm">
                          {user.email}
                        </td>
                        
                        <td className="px-4 py-3 text-sm">
                          {getRoleBadge(user.role)}
                        </td>
                        
                        <td className="px-4 py-3 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUserId(user.id);
                                  setNewRole(user.role);
                                  setShowChangeRoleDialog(true);
                                }}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BookCopy className="h-4 w-4 mr-2" />
                                View Loans
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the user "{user.name}" and all associated data.
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleDeleteUser(user.id)}
                                      disabled={isProcessing}
                                    >
                                      {isProcessing ? 'Deleting...' : 'Delete'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No users found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No users have been added yet'}
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}>
                  View all users
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Add user dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specified role
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                placeholder="John Smith"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                placeholder="john.smith@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={newUserData.password}
                onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select 
                value={newUserData.role} 
                onValueChange={(value) => setNewUserData({...newUserData, role: value as Role})}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reader">Reader</SelectItem>
                  <SelectItem value="librarian">Librarian</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddUserDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change role dialog */}
      <Dialog open={showChangeRoleDialog} onOpenChange={setShowChangeRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the user's role and permissions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="change-role" className="text-sm font-medium">
                Role
              </label>
              <Select 
                value={newRole} 
                onValueChange={(value) => setNewRole(value as Role)}
              >
                <SelectTrigger id="change-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reader">Reader</SelectItem>
                  <SelectItem value="librarian">Librarian</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <Check className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="font-medium">Reader</p>
                    <p className="text-muted-foreground">Can view the catalog and manage personal loans</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Check className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="font-medium">Librarian</p>
                    <p className="text-muted-foreground">Can manage books and loans for all users</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Check className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="font-medium">Admin</p>
                    <p className="text-muted-foreground">Can manage all system aspects, including user roles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowChangeRoleDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleChangeRole}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Update Role
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Users;
