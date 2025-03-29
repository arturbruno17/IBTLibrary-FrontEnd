import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Loan, LoanStatus, Book, User, Role } from "@/types";
import { Button } from "@/components/ui/button";
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
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { mockBooks, mockUsers } from "@/data/mockData";
import { booksAPI, usersAPI, loansAPI } from "@/services/api";

type LoanFilter = "all" | "IN_DAYS" | "RETURNED" | "OVERDUE";

const Loans = () => {
  const { user, hasRole, loading: authLoading } = useAuth();
  const isLibrarianOrAdmin = hasRole([Role.LIBRARIAN, Role.ADMIN]);
console.log("User ID:", user?.id);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<LoanFilter>("all");
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [creatingLoan, setCreatingLoan] = useState(false);

  const [page, setPage] = useState(0);
  const [limit] = useState(10);

  const [processingLoanId, setProcessingLoanId] = useState<number | null>(null);
//   const fetchAllBooks = async (): Promise<Book[]> => {
//     let page = 0;
//     const limit = 50;
//     let allBooks: Book[] = [];

//     while (true) {
//       const booksPage = await booksAPI.getAll(page, limit);
//       allBooks = allBooks.concat(booksPage);

//       if (booksPage.length < limit) break;
//       page++;
//     }

//     return allBooks;
//   };
useEffect(() => {
    console.log("Auth loading:", user.id);
},[authLoading])

  useEffect(() => {
    const loadBooksAndUsers = async () => {
      try {
        const [books, users] = await Promise.all([
        //   fetchAllBooks(),
        booksAPI.getAll(0), // 👈 aqui
          usersAPI.getAll(0), // 👈 aqui
        ]);

        const available = books.filter((book) => book.quantity > 0);
        const readers = users.filter(
          (user) => user.role === Role.READER || user.role === Role.LIBRARIAN
        );

        setAvailableBooks(available);
        setAvailableUsers(readers);
      } catch (error) {
        toast.error("Erro ao carregar livros ou usuários");
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (showLoanDialog) {
      loadBooksAndUsers();
    }
  }, [showLoanDialog]);




  const loadLoans = async () => {
    setLoading(true);

    try {
      const filters: {
        page: number;
        limit: number;
        person_id?: number;
        types?: LoanStatus[];
      } = {
        page,
        limit,
      };

      if (!isLibrarianOrAdmin && user?.id) {
        filters.person_id = user.id;
      }

      if (filter !== "all") {
        filters.types = [filter as LoanStatus];
      }

      const fetched = await loansAPI.getAllLoans(filters);
      setLoans(fetched); // apenas o que vem da API
    } catch (error) {
      toast.error("Erro ao carregar empréstimos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLibrarianOrAdmin || user?.id) {
      loadLoans();
    }
  }, [isLibrarianOrAdmin, user?.id, page, filter]);

  useEffect(() => {
    const loadBooksAndUsers = async () => {
      try {
        const [books, users] = await Promise.all([
          booksAPI.getAll(),
          usersAPI.getAll(),
        ]);

        const available = books.filter((book) => book.quantity > 0);
        const readers = users.filter(
          (user) => user.role === Role.READER || Role.LIBRARIAN
        );

        setAvailableBooks(available);
        setAvailableUsers(readers);

        console.log("Available books from API:", available);
        console.log("Available users from API:", readers);
      } catch (error) {
        toast.error("Erro ao carregar livros ou usuários");
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (showLoanDialog) {
      loadBooksAndUsers();
    }
  }, [showLoanDialog]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLoans(loans);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = loans.filter(
      (loan) =>
        loan.book?.title.toLowerCase().includes(query) ||
        loan.book?.author.toLowerCase().includes(query) ||
        loan.person?.name.toLowerCase().includes(query)
    );

    setFilteredLoans(results);
  }, [searchQuery, loans]);

  useEffect(() => {
    console.log("Loans carregados da API:", loans);
  }, [loans]);

  const handleCreateLoan = async () => {
    if (!selectedBook || !selectedUser) {
      toast.error("Please select both a book and a user");
      return;
    }

    setCreatingLoan(true);

    try {
      await loansAPI.create(selectedBook, selectedUser);

      toast.success("Loan created successfully!");
      setShowLoanDialog(false);
      setSelectedBook("");
      setSelectedUser("");
    } catch (error) {
      console.error("Error creating loan:", error);
      toast.error("Failed to create loan.");
    } finally {
      setCreatingLoan(false);
    }
  };

  const handleReturnBook = async (id: number) => {
    setProcessingLoanId(id);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const loanIndex = loans.findIndex((l) => l.id === id);
    if (loanIndex >= 0) {
      const loan = loans[loanIndex];

      const updatedLoan = {
        ...loan,
        status: LoanStatus.RETURNED,
        returnDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const bookIndex = mockBooks.findIndex((b) => b.id === loan.book.id);
      if (bookIndex >= 0) {
        mockBooks[bookIndex] = {
          ...mockBooks[bookIndex],
          quantity: mockBooks[bookIndex].quantity + 1,
        };
      }

      const updatedLoans = [...loans];
      updatedLoans[loanIndex] = updatedLoan;
      setLoans([...loans.slice(0, loanIndex), updatedLoan, ...loans.slice(loanIndex + 1)]);

      //   const mockLoanIndex = mockLoans.findIndex((l) => l.id === loanId);
      //   if (mockLoanIndex >= 0) {
      //     mockLoans[mockLoanIndex] = updatedLoan;
      //   }

      const returnLoan = await loansAPI.return(id);

      toast.success(`Book "${loan.book.title}" has been returned`);
    }

    setProcessingLoanId(null);
  };

  const handleExtendLoan = async (id: number) => {
    setProcessingLoanId(id);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const loan = loans.find((l) => l.id === id);
      if (!loan) {
        toast.error("Empréstimo não encontrado.");
        return;
      }

      await loansAPI.extend(id);
      await loadLoans(); // 👈 Aqui está o segredo

      toast.success(
        `O empréstimo de "${loan.book.title}" foi estendido com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao estender empréstimo:", error);
      toast.error("Erro ao estender o empréstimo.");
    } finally {
      setProcessingLoanId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).getTime() > 0;
  };

  const getLoanStatusBadge = (loan: Loan) => {
    const status = deriveLoanStatus(loan);

    if (status === LoanStatus.RETURNED) {
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-700 hover:bg-green-500/20"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Returned
        </Badge>
      );
    }

    if (status === LoanStatus.OVERDUE) {
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive hover:bg-destructive/20"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    if (status === LoanStatus.INDAYS) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20"
        >
          <BookCopy className="h-3 w-3 mr-1" />
          Em dia
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20"
      >
        <BookCopy className="h-3 w-3 mr-1" />
        Em dia
      </Badge>
    );
  };

  const calculateDueDate = (startDate: string, duration: number): string => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + duration);
    return start.toISOString();
  };
  const deriveLoanStatus = (loan: Loan): LoanStatus => {
    if (loan.return_date) return LoanStatus.RETURNED;

    const dueDate = new Date(calculateDueDate(loan.start_date, loan.duration));
    const now = new Date();

    if (now > dueDate) return LoanStatus.OVERDUE;

    return LoanStatus.INDAYS;
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1>
              {isLibrarianOrAdmin
                ? "Gestão de empréstimos"
                : "Meus empréstimos"}
            </h1>
            <p className="text-muted-foreground">
              {isLibrarianOrAdmin
                ? "Gerenciar empréstimos e devoluções de livros"
                : "Acompanhe seus livros emprestados e datas de entrega"}
            </p>
          </div>

          {isLibrarianOrAdmin && (
            <Button onClick={() => setShowLoanDialog(true)}>
              <BookCopy className="h-4 w-4 mr-2" />
              Emitir novo empréstimo
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${
                isLibrarianOrAdmin ? "books or users" : "your loans"
              }...`}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtre Pelos Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === "all"} />
                    <span>Todos os empréstimos</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("IN_DAYS")}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === "IN_DAYS"} />
                    <span>Em dia</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("RETURNED")}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === "RETURNED"} />
                    <span>Retornada</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("OVERDUE")}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === "OVERDUE"} />
                    <span>Atrasada</span>
                  </div>
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => setFilter("extended")}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={filter === "extended"} />
                    <span>Extended</span>
                  </div>
                </DropdownMenuItem> */}
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
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Livro
                        </th>
                        {isLibrarianOrAdmin && (
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Leitor
                          </th>
                        )}
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Data do empréstimo
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Data de vencimento
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredLoans.map((loan) => {
                        return (
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
                                  <div className="text-xs text-muted-foreground">
                                    {loan.book.author}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {isLibrarianOrAdmin && (
                              <td className="px-4 py-3 text-sm">
                                <div className="font-medium">
                                  {loan.person.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {loan.person.email}
                                </div>
                              </td>
                            )}

                            <td className="px-4 py-3 text-sm">
                              {formatDate(loan.start_date)}
                            </td>

                            <td className="px-4 py-3 text-sm">
                              <span
                                className={
                                  isOverdue(loan.return_date) &&
                                  loan.type !== "RETURNED"
                                    ? "text-destructive"
                                    : ""
                                }
                              >
                                {formatDate(
                                  calculateDueDate(
                                    loan.start_date,
                                    loan.duration
                                  )
                                )}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-sm">
                              {getLoanStatusBadge(loan)}
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end space-x-2">
                                {deriveLoanStatus(loan) ===
                                  LoanStatus.INDAYS && (
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
                                      <span className="ml-1 hidden sm:inline">
                                        Extend
                                      </span>
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
                                      <span className="ml-1 hidden sm:inline">
                                        Return
                                      </span>
                                    </Button>
                                  </>
                                )}

                                {deriveLoanStatus(loan) ===
                                  LoanStatus.OVERDUE && (
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
                                    <span className="ml-1 hidden sm:inline">
                                      Return
                                    </span>
                                  </Button>
                                )}

                                {deriveLoanStatus(loan) ===
                                  LoanStatus.EXTENDED && (
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
                                    <span className="ml-1 hidden sm:inline">
                                      Return
                                    </span>
                                  </Button>
                                )}

                                {deriveLoanStatus(loan) ===
                                  LoanStatus.RETURNED && (
                                  <span className="text-xs text-muted-foreground px-2">
                                    {loan.return_date
                                      ? `Retornado em ${formatDate(
                                          loan.return_date
                                        )}`
                                      : "Returned"}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
                  {searchQuery || filter !== "all"
                    ? "Try adjusting your search or filters"
                    : isLibrarianOrAdmin
                    ? "No loans have been issued yet"
                    : "You don't have any active loans"}
                </p>
                {searchQuery || filter !== "all" ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("all");
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                ) : isLibrarianOrAdmin ? (
                  <Button onClick={() => setShowLoanDialog(true)}>
                    <BookCopy className="h-4 w-4 mr-2" />
                    Criar novo empréstimo
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
            <DialogTitle>Criar novo empréstimo</DialogTitle>
            <DialogDescription>
              Selecione um livro e um usuário para criar um novo empréstimo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="book">Livro</Label>
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger id="book">
                  <SelectValue placeholder="Select a book" />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.length > 0 ? (
                    availableBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id.toString()}>
                        {book.title} by {book.author} ({book.quantity}{" "}
                        available)
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No books available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">Usuário</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start space-x-2 text-sm">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Os livros são emprestados por um período padrão de 14 dias.
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLoanDialog(false)}
              disabled={creatingLoan}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateLoan}
              disabled={!selectedBook || !selectedUser || creatingLoan}
            >
              {creatingLoan ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <BookCopy className="h-4 w-4 mr-2" />
                  Criar empréstimo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-center mt-8 space-x-2">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </Button>
        <span className="px-4 py-2 text-sm text-muted-foreground">
          Página {page + 1}
        </span>
        <Button
          variant="outline"
          disabled={filteredLoans.length < limit}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </Button>
      </div>
    </Layout>
  );
};

export default Loans;
