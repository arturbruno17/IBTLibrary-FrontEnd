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

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    publisher: 'Scribner',
    publishedYear: 1925,
    description: 'A story of wealth, love, and tragedy set in the Roaring Twenties.',
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
  const isLibrarianOrAdmin = hasRole([Role.LIBRARIAN, Role.ADMIN]);
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundBook = mockBooks.find(book => book.id === id);
      setBook(foundBook || null);
      setLoading(false);
    };
    
    fetchBook();
  }, [id]);
  
  const handleBorrow = async () => {
    if (!book || !user) return;
    
    setBorrowing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Empréstimo de "${book.title}" realizado com sucesso`);
    setBook(prev => prev ? { ...prev, availableQuantity: prev.availableQuantity - 1 } : null);
    
    setBorrowing(false);
  };
  
  const handleDelete = async () => {
    if (!book) return;
    
    setDeleting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Livro "${book.title}" excluído com sucesso`);
    
    setDeleting(false);
    navigate('/catalog');
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando detalhes do livro...</p>
        </div>
      </Layout>
    );
  }
  
  if (!book) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Livro não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O livro que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
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
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <h2 className="text-xl text-muted-foreground mb-4">por {book.author}</h2>
              
              <Badge 
                className={`py-1 px-2 ${
                  isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-destructive hover:bg-destructive/90'
                }`}
              >
                {isAvailable ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Disponível ({book.availableQuantity} de {book.quantity})
                  </span>
                ) : (
                  <span>Indisponível no momento</span>
                )}
              </Badge>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">{book.description || 'Sem descrição disponível.'}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Detalhes</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium">ISBN</dt>
                  <dd className="text-muted-foreground">{book.isbn}</dd>
                  
                  <dt className="font-medium">Editora</dt>
                  <dd className="text-muted-foreground">{book.publisher || 'Desconhecida'}</dd>
                  
                  <dt className="font-medium">Ano de Publicação</dt>
                  <dd className="text-muted-foreground">{book.publishedYear || 'Desconhecido'}</dd>
                  
                  <dt className="font-medium">Total de Exemplares</dt>
                  <dd className="text-muted-foreground">{book.quantity}</dd>
                  
                  <dt className="font-medium">Exemplares Disponíveis</dt>
                  <dd className={`${isAvailable ? 'text-green-600' : 'text-destructive'} font-medium`}>
                    {book.availableQuantity}
                  </dd>
                </dl>
              </div>
              
              <Separator />
              
              {isLibrarianOrAdmin && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Histórico de Empréstimos</h3>
                  
                  <div className="border rounded-md">
                    <div className="p-4 text-center text-muted-foreground">
                      <p>Registros recentes de empréstimos aparecerão aqui.</p>
                      <p className="text-sm">Nenhum registro de empréstimo encontrado para este livro.</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                {isLibrarianOrAdmin ? (
                  <>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to={`/edit-book/${book.id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar Livro
                      </Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="justify-start text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir Livro
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o livro
                            "{book.title}" e todos os registros de empréstimo associados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDelete}
                            disabled={deleting}
                          >
                            {deleting ? 'Excluindo...' : 'Excluir'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <>
                    <Button 
                      className="justify-start" 
                      disabled={!isAvailable || borrowing}
                      onClick={handleBorrow}
                    >
                      <BookCopy className="h-4 w-4 mr-2" />
                      {borrowing ? 'Processando...' : 'Emprestar Livro'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
