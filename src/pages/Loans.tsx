import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import {
  BookCopy,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  BookOpen,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { loansAPI, usersAPI, booksAPI } from "@/services/api";
import { LoanStatus, Role } from "@/types";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [totalLoans, setTotalLoans] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [updatingLoan, setUpdatingLoan] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [bookResults, setBookResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [duration, setDuration] = useState(15);
  const [creatingLoan, setCreatingLoan] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const { hasRole, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLibrarianOrAdmin = hasRole([Role.LIBRARIAN, Role.ADMIN]);

  useEffect(() => {
    const userIdParam = searchParams.get("user");
    if (userIdParam) {
      setCurrentUserId(userIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchLoans({ page, limit, types: selectedStatus, person_id: currentUserId });
  }, [page, limit, selectedStatus, currentUserId]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersData = await usersAPI.getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Erro ao carregar usuários");
      }
    };

    if (isLibrarianOrAdmin) {
      fetchUsersData();
    }
  }, [isLibrarianOrAdmin]);

  const fetchLoans = async (options = {}) => {
    try {
      setLoading(true);
      
      // Convert person_id to number if it's a string
      if (options.person_id && typeof options.person_id === 'string') {
        options.person_id = parseInt(options.person_id, 10);
      }
      
      // Convert book_id to number if it's a string
      if (options.book_id && typeof options.book_id === 'string') {
        options.book_id = parseInt(options.book_id, 10);
      }
      
      const loansData = await loansAPI.getAllLoans(options);
      setLoans(loansData);
      setTotalLoans(loansData.length || 0);
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Erro ao carregar empréstimos");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setPage(0);
  };

  const handleUserFilterChange = (userId) => {
    setCurrentUserId(userId);
    setPage(0);
  };

  const handleBookSearch = async () => {
    if (!bookSearch.trim()) {
      toast.error("Por favor, insira um título ou ISBN para buscar");
      return;
    }

    setLoadingBooks(true);
    setSearchPerformed(true);

    try {
      const bookData = await booksAPI.getAll(0, 5, bookSearch);
      setBookResults(bookData);
    } catch (error) {
      console.error("Error searching books:", error);
      toast.error("Erro ao buscar livros");
      setBookResults([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  const resetForm = () => {
    setUserId("");
    setBookSearch("");
    setBookResults([]);
    setSelectedBook(null);
    setDuration(15);
    setSearchPerformed(false);
  };

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert userId to number if it's a string
    const personId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const bookId = typeof selectedBook?.id === 'string' ? parseInt(selectedBook.id as string, 10) : selectedBook?.id;
    
    if (!personId || !bookId) {
      toast.error("Selecione um usuário e um livro");
      return;
    }
    
    setCreatingLoan(true);
    
    try {
      await loansAPI.createLoan({
        person_id: personId,
        book_id: bookId,
        duration: duration,
        type: LoanStatus.PENDING,
      });
      
      toast.success("Empréstimo criado com sucesso!");
      setShowCreateDialog(false);
      resetForm();
      fetchLoans({ page, limit, types: selectedStatus, person_id: currentUserId });
    } catch (error) {
      console.error("Error creating loan:", error);
      toast.error("Erro ao criar empréstimo");
    } finally {
      setCreatingLoan(false);
    }
  };

  const handleExtendLoan = async (loanId: number) => {
    setUpdatingLoan(true);
    try {
      await loansAPI.extendLoan(loanId);
      toast.success("Empréstimo estendido com sucesso!");
      
      // Refresh the loans list
      fetchLoans({ page, limit, types: selectedStatus, person_id: currentUserId });
    } catch (error) {
      console.error("Error extending loan:", error);
      toast.error("Erro ao estender empréstimo");
    } finally {
      setUpdatingLoan(false);
    }
  };

  const handleReturnLoan = async (loanId: number) => {
    setUpdatingLoan(true);
    try {
      await loansAPI.returnLoan(loanId);
      toast.success("Livro devolvido com sucesso!");
      
      // Refresh the loans list
      fetchLoans({ page, limit, types: selectedStatus, person_id: currentUserId });
    } catch (error) {
      console.error("Error returning loan:", error);
      toast.error("Erro ao devolver livro");
    } finally {
      setUpdatingLoan(false);
    }
  };

  // JSX part starts here
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1>Empréstimos</h1>
          {isLibrarianOrAdmin && (
            <DialogTrigger asChild>
              <Button>Criar Empréstimo</Button>
            </DialogTrigger>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Status filter */}
          <div>
            <Label htmlFor="status">Filtrar por Status</Label>
            <Select
              id="status"
              value={selectedStatus}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value={LoanStatus.PENDING}>Pendente</SelectItem>
                <SelectItem value={LoanStatus.IN_DAYS}>Ativo</SelectItem>
                <SelectItem value={LoanStatus.OVERDUE}>Atrasado</SelectItem>
                <SelectItem value={LoanStatus.RETURNED}>Devolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User filter */}
          {isLibrarianOrAdmin && (
            <div>
              <Label htmlFor="user">Filtrar por Leitor</Label>
              <Select
                id="user"
                value={currentUserId}
                onValueChange={handleUserFilterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os Leitores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Limit filter */}
          <div>
            <Label htmlFor="limit">Itens por página</Label>
            <Select id="limit" value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando empréstimos...</p>
          </div>
        ) : loans.length > 0 ? (
          <>
            {/* Loan cards */}
            <div className="grid grid-cols-1 gap-4">
              {loans.map((loan) => {
                const isOverdue = loan.type === LoanStatus.OVERDUE;
                const isPending = loan.type === LoanStatus.PENDING;
                const isActive = loan.type === "IN_DAYS" || loan.type === "pending" || loan.type === "extended";
                const isReturned = loan.type === LoanStatus.RETURNED;

                const cardClasses = cn(
                  "border rounded-lg overflow-hidden transition-all",
                  {
                    "border-red-200 dark:border-red-800": isOverdue,
                    "border-yellow-200 dark:border-yellow-800": isPending,
                    "border-green-200 dark:border-green-800": isReturned,
                  }
                );

                return (
                  <Card key={loan.id} className={cardClasses}>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        {/* Book info */}
                        <div className="p-4 md:p-6 flex flex-col justify-between bg-muted/30">
                          <div>
                            <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                              {loan.book.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2">
                              por {loan.book.author}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <BookOpen className="h-3.5 w-3.5 mr-1" />
                              <span>ISBN: {loan.book.isbn}</span>
                            </div>
                          </div>

                          {isLibrarianOrAdmin && (
                            <Link
                              to={`/livros/${loan.book.id}`}
                              className="text-sm text-primary hover:underline mt-4 inline-flex items-center"
                            >
                              <BookOpen className="h-3.5 w-3.5 mr-1" />
                              Ver detalhes do livro
                            </Link>
                          )}
                        </div>

                        {/* Loan details */}
                        <div className="p-4 md:p-6 md:col-span-2 flex flex-col">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center">
                                <Badge
                                  className={cn("px-2 py-0.5", {
                                    "bg-red-500 hover:bg-red-600": isOverdue,
                                    "bg-yellow-500 hover:bg-yellow-600": isPending,
                                    "bg-green-500 hover:bg-green-600": isReturned,
                                    "bg-blue-500 hover:bg-blue-600": !isOverdue && !isPending && !isReturned,
                                  })}
                                >
                                  {isOverdue
                                    ? "Atrasado"
                                    : isReturned
                                    ? "Devolvido"
                                    : isPending
                                    ? "Pendente"
                                    : "Ativo"}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-0.5">
                                Data de Empréstimo
                              </p>
                              <p className="font-medium">
                                {new Date(loan.start_date).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-0.5">
                                Data Prevista de Devolução
                              </p>
                              <p
                                className={cn("font-medium", {
                                  "text-red-600": isOverdue,
                                })}
                              >
                                {new Date(
                                  new Date(loan.start_date).getTime() +
                                    loan.duration * 24 * 60 * 60 * 1000
                                ).toLocaleDateString("pt-BR")}
                              </p>
                            </div>

                            {loan.return_date && (
                              <div>
                                <p className="text-muted-foreground mb-0.5">
                                  Data de Devolução
                                </p>
                                <p className="font-medium">
                                  {new Date(loan.return_date).toLocaleDateString(
                                    "pt-BR"
                                  )}
                                </p>
                              </div>
                            )}

                            <div>
                              <p className="text-muted-foreground mb-0.5">
                                Duração
                              </p>
                              <p className="font-medium">
                                {loan.duration} dias
                              </p>
                            </div>
                          </div>

                          {isLibrarianOrAdmin && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-muted-foreground mb-0.5 text-sm">
                                Leitor
                              </p>
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                                  {loan.person.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {loan.person.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {loan.person.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="p-4 md:p-6 flex md:flex-col justify-end md:justify-center border-t md:border-t-0 md:border-l">
                          {isActive && (
                            <div className="flex gap-2 md:flex-col">
                              {!isReturned && (
                                <Button
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                  onClick={() => handleReturnLoan(loan.id)}
                                  disabled={updatingLoan}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Devolver
                                </Button>
                              )}

                              {!isReturned && !isOverdue && (
                                <Button
                                  variant="outline"
                                  onClick={() => handleExtendLoan(loan.id)}
                                  disabled={updatingLoan}
                                >
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Estender
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Página anterior</span>
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Página {page + 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={loans.length < limit}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Próxima página</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <BookCopy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-xl font-medium mb-2">
              Nenhum empréstimo encontrado
            </h3>
            <p className="text-muted-foreground">
              {currentUserId
                ? "Você ainda não tem empréstimos de livros"
                : "Não há empréstimos que correspondam aos filtros selecionados"}
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/catalogo">Explorar Catálogo</Link>
            </Button>
          </div>
        )}

        {/* Create loan dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Empréstimo</DialogTitle>
              <DialogDescription>
                Selecione um usuário e um livro para criar um novo empréstimo
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateLoan}>
              <div className="grid gap-4 py-4">
                {/* User selection */}
                <div className="grid gap-2">
                  <Label htmlFor="user">Leitor</Label>
                  <Select
                    value={userId.toString()}
                    onValueChange={setUserId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um leitor" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Book selection */}
                <div className="grid gap-2">
                  <Label htmlFor="book">Livro</Label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        id="bookSearch"
                        placeholder="Buscar por título ou ISBN"
                        value={bookSearch}
                        onChange={(e) => setBookSearch(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleBookSearch}
                      disabled={loadingBooks}
                    >
                      {loadingBooks ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {bookResults.length > 0 && (
                    <div className="max-h-48 overflow-y-auto border rounded-md mt-2">
                      {bookResults.map((book) => (
                        <div
                          key={book.id}
                          className={cn(
                            "p-2 cursor-pointer hover:bg-accent flex items-start border-b last:border-b-0",
                            selectedBook?.id === book.id &&
                              "bg-accent"
                          )}
                          onClick={() => setSelectedBook(book)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{book.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {book.author} • ISBN: {book.isbn}
                            </p>
                          </div>
                          <Badge
                            variant={
                              book.available > 0 ? "default" : "destructive"
                            }
                          >
                            {book.available} disponível
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchPerformed && bookResults.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Nenhum livro encontrado
                    </p>
                  )}

                  {selectedBook && (
                    <div className="flex items-center mt-2 p-2 border rounded-md bg-accent">
                      <div className="flex-1">
                        <p className="font-medium">{selectedBook.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedBook.author} • {selectedBook.available} disponíveis
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBook(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Duration selector */}
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="duration">
                      Duração do empréstimo (dias)
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {duration} dias
                    </span>
                  </div>
                  <Slider
                    id="duration"
                    min={7}
                    max={30}
                    step={1}
                    value={[duration]}
                    onValueChange={(values) => setDuration(values[0])}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    creatingLoan ||
                    !userId ||
                    !selectedBook ||
                    selectedBook.available === 0
                  }
                >
                  {creatingLoan ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Empréstimo"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Loans;
