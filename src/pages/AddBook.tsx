
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Loader2,
  Scan,
  Search,
  Plus,
  Minus,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Book, Role } from '@/types';
import BarcodeScanner from '@/components/BarcodeScanner';
import { parseOpenLibraryBook, searchByISBN } from '@/services/openLibraryApi';
import { mockBooks } from '@/data/mockData';
import { booksAPI } from '@/services/api';

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
}

const AddBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole,  } = useAuth();
  
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    quantity: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isbnLoading, setIsbnLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  // Fetch book details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBook = async () => {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const book = mockBooks.find(b => b.id === id);
        
        if (book) {
          setFormData({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            quantity: book.quantity
          });
        } else {
          toast.error('Livro não encontrado');
          navigate('/catalog');
        }
        
        setLoading(false);
      };
      
      fetchBook();
    }
  }, [id, isEditMode, navigate]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle quantity changes
  const handleQuantityChange = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + amount)
    }));
  };
  
  // Handle ISBN search
  const handleIsbnSearch = async (isbn: string) => {
    if (!isbn.trim()) {
      toast.error('Por favor, insira um ISBN para pesquisar');
      return;
    }
    
    setIsbnLoading(true);
    try {
      const bookData = await searchByISBN(isbn);
      
      if (bookData) {
        const parsedBook = parseOpenLibraryBook(bookData);
        
        setFormData({
          title: parsedBook.title || '',
          author: parsedBook.author || '',
          isbn: parsedBook.isbn || isbn,
          quantity: formData.quantity
        });
        
        toast.success('Informações do livro encontradas!');
      } else {
        toast.error('Nenhum livro encontrado com este ISBN');
      }
    } catch (error) {
      console.error('Erro ao pesquisar ISBN:', error);
      toast.error('Erro ao pesquisar o livro');
    } finally {
      setIsbnLoading(false);
    }
  };
  
  // Handle scanner detection
  const handleScannerDetection = (detectedIsbn: string) => {
    setFormData(prev => ({ ...prev, isbn: detectedIsbn }));
    setShowScanner(false);
    handleIsbnSearch(detectedIsbn);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.isbn) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setSubmitting(true);

    try {
      if (!isEditMode) {
        // Chama a API de criação de livro
        await booksAPI.create({
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          quantity: formData.quantity,
        });

        toast.success(`Livro "${formData.title}" adicionado com sucesso`);
      } else {
        // Aqui você pode adicionar booksAPI.update quando criar essa função
        toast.error('Modo de edição ainda não implementado com API');
      }

      navigate('/catalog');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      toast.error('Ocorreu um erro ao salvar o livro');
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando dados do livro...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Link>
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h1>{isEditMode ? 'Editar Livro' : 'Adicionar Novo Livro'}</h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? 'Atualize as informações deste livro'
                : 'Preencha os detalhes para adicionar um novo livro ao catálogo'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ISBN section with scanner */}
            <div className="p-6 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Busca por ISBN</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScanner(true)}
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Escanear Código de Barras
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    placeholder="Digite o ISBN (ex: 9780061120084)"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => handleIsbnSearch(formData.isbn)}
                    disabled={isbnLoading}
                  >
                    {isbnLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    {isbnLoading ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Digite um ISBN e clique em Buscar para preencher automaticamente os detalhes do livro, ou use o scanner.
              </p>
            </div>
            
            {/* Book details form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Título <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Título do livro"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">
                    Autor <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Nome do autor"
                    required
                  />
                </div>
                
                {/*<div className="space-y-2">*/}
                {/*  <Label htmlFor="publisher">Editora</Label>*/}
                {/*  <Input*/}
                {/*    id="publisher"*/}
                {/*    name="publisher"*/}
                {/*    value={formData.publisher}*/}
                {/*    onChange={handleChange}*/}
                {/*    placeholder="Nome da editora"*/}
                {/*  />*/}
                {/*</div>*/}
                
                {/*<div className="space-y-2">*/}
                {/*  <Label htmlFor="publishedYear">Ano de Publicação</Label>*/}
                {/*  <Input*/}
                {/*    id="publishedYear"*/}
                {/*    name="publishedYear"*/}
                {/*    value={formData.publishedYear}*/}
                {/*    onChange={handleChange}*/}
                {/*    placeholder="Ano de publicação"*/}
                {/*    type="number"*/}
                {/*  />*/}
                {/*</div>*/}
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={formData.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      type="number"
                      min="1"
                      className="text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right column */}
              {/*<div className="space-y-4">*/}
              {/*  <div className="space-y-2">*/}
              {/*    <Label htmlFor="description">Descrição</Label>*/}
              {/*    <Textarea*/}
              {/*      id="description"*/}
              {/*      name="description"*/}
              {/*      value={formData.description}*/}
              {/*      onChange={handleChange}*/}
              {/*      placeholder="Descrição do livro"*/}
              {/*      rows={12}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            
            {/* Form actions */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/catalog')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? 'Atualizando...' : 'Salvando...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Atualizar Livro' : 'Salvar Livro'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Barcode scanner modal */}
        <BarcodeScanner
          onDetected={handleScannerDetection}
          isVisible={showScanner}
          onClose={() => setShowScanner(false)}
        />
      </div>
    </Layout>
  );
};

export default AddBook;
