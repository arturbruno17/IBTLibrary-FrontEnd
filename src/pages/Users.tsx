
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
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: Role.READER,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@exemplo.com',
    role: Role.READER,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'David Santos',
    email: 'david@exemplo.com',
    role: Role.READER,
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Sara Fernandes',
    email: 'sara@exemplo.com',
    role: Role.LIBRARIAN,
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Miguel Castro',
    email: 'miguel@exemplo.com',
    role: Role.ADMIN,
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z'
  }
];

type UserFilter = 'all' | 'reader' | 'librarian' | 'admin';

const Users = () => {
  const { user, hasRole } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<UserFilter>('all');
  
  // Dialog states
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<Role>(Role.READER);
  
  // Form data for new user
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: Role.READER
  });
  
  // Action states
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(mockUsers);
      
      setLoading(false);
    };
    
    loadUsers();
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply role filter
    if (filter !== 'all') {
      result = result.filter(user => {
        if (filter === 'reader') return user.role === Role.READER;
        if (filter === 'librarian') return user.role === Role.LIBRARIAN;
        if (filter === 'admin') return user.role === Role.ADMIN;
        return true;
      });
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
      toast.error('Por favor, preencha todos os campos obrigatórios');
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
    
    toast.success(`Usuário "${name}" adicionado com sucesso`);
    
    // Reset form and close dialog
    setNewUserData({
      name: '',
      email: '',
      password: '',
      role: Role.READER
    });
    setShowAddUserDialog(false);
    setIsProcessing(false);
  };
  
  // Handle changing user role
  const handleChangeRole = async () => {
    if (!selectedUserId || !newRole) {
      return;
    }
    
    // Check if trying to set an admin role
    if (newRole === Role.ADMIN) {
      toast.error('Não é possível definir um usuário como administrador');
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
      const roleName = newRole === Role.LIBRARIAN ? 'bibliotecário' : 'leitor';
      toast.success(`Função de ${selectedUser.name} atualizada para ${roleName}`);
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
      toast.success(`Usuário "${userToDelete.name}" excluído com sucesso`);
    }
    
    setIsProcessing(false);
  };
  
  // Check if user can be edited (only admins can edit other users, users can edit themselves)
  const canEditUser = (userId: string) => {
    return hasRole(Role.ADMIN) || (user && user.id === userId);
  };
  
  // Get role badge for a user
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
            <Shield className="h-3 w-3 mr-1" />
            Administrador
          </Badge>
        );
      case Role.LIBRARIAN:
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            <BookCopy className="h-3 w-3 mr-1" />
            Bibliotecário
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20">
            Leitor
          </Badge>
        );
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1>Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie usuários e suas funções
            </p>
          </div>
          
          {hasRole(Role.ADMIN) && (
            <Button onClick={() => setShowAddUserDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Novo Usuário
            </Button>
          )}
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários por nome ou email..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por Função</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'all'} />
                    <span>Todos os Usuários</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('reader')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'reader'} />
                    <span>Leitores</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('librarian')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'librarian'} />
                    <span>Bibliotecários</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('admin')}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === 'admin'} />
                    <span>Administradores</span>
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
            <p className="text-muted-foreground">Carregando usuários...</p>
          </div>
        ) : (
          <>
            {filteredUsers.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Usuário</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Função</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Membro Desde</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((userItem) => (
                      <tr key={userItem.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              {userItem.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{userItem.name}</span>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3 text-sm">
                          {userItem.email}
                        </td>
                        
                        <td className="px-4 py-3 text-sm">
                          {getRoleBadge(userItem.role)}
                        </td>
                        
                        <td className="px-4 py-3 text-sm">
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </td>
                        
                        <td className="px-4 py-3 text-right">
                          {canEditUser(userItem.id) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Settings className="h-4 w-4" />
                                  <span className="sr-only">Ações</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {hasRole(Role.ADMIN) && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedUserId(userItem.id);
                                      setNewRole(userItem.role);
                                      setShowChangeRoleDialog(true);
                                    }}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Alterar Função
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <BookCopy className="h-4 w-4 mr-2" />
                                  Ver Empréstimos
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {hasRole(Role.ADMIN) && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir Usuário
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Isso excluirá permanentemente o usuário "{userItem.name}" e todos os dados associados.
                                          Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          onClick={() => handleDeleteUser(userItem.id)}
                                          disabled={isProcessing}
                                        >
                                          {isProcessing ? 'Excluindo...' : 'Excluir'}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
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
                <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filter !== 'all'
                    ? 'Tente ajustar sua busca ou filtros'
                    : 'Nenhum usuário foi adicionado ainda'}
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}>
                  Ver todos os usuários
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
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie uma nova conta de usuário com função específica
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome Completo
              </label>
              <Input
                id="name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                placeholder="João Silva"
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
                placeholder="joao.silva@exemplo.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
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
                Função
              </label>
              <Select 
                value={newUserData.role} 
                onValueChange={(value) => setNewUserData({...newUserData, role: value as Role})}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.READER}>Leitor</SelectItem>
                  <SelectItem value={Role.LIBRARIAN}>Bibliotecário</SelectItem>
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
              Cancelar
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Usuário
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
            <DialogTitle>Alterar Função do Usuário</DialogTitle>
            <DialogDescription>
              Atualizar a função e permissões do usuário
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="change-role" className="text-sm font-medium">
                Função
              </label>
              <Select 
                value={newRole} 
                onValueChange={(value) => setNewRole(value as Role)}
              >
                <SelectTrigger id="change-role">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.READER}>Leitor</SelectItem>
                  <SelectItem value={Role.LIBRARIAN}>Bibliotecário</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <Check className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="font-medium">Leitor</p>
                    <p className="text-muted-foreground">Pode visualizar o catálogo e gerenciar empréstimos pessoais</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Check className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="font-medium">Bibliotecário</p>
                    <p className="text-muted-foreground">Pode gerenciar livros e empréstimos para todos os usuários</p>
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
              Cancelar
            </Button>
            <Button 
              onClick={handleChangeRole}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Atualizar Função
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
