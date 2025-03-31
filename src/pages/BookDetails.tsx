import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Book, Loan, Role } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  BookCopy,
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { booksAPI, loansAPI } from "@/services/api";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { hasRole, user } = useAuth();
  const navigate = useNavigate();
  const isLibrarianOrAdmin = hasRole([Role.LIBRARIAN, Role.ADMIN]);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [bookLoans, setBookLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 👈 só pra testar
        const bookData = await booksAPI.getById(id!);
        setBook(bookData);
      } catch (error) {
        console.error("Erro ao buscar livro:", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchLoans = async () => {
      try {
        setLoadingLoans(true);
        const loans = await loansAPI.getAllLoans({
          book_id: Number(id),
          limit: 100,
        });
        setBookLoans(loans);
      } catch (err) {
        console.error("Erro ao buscar empréstimos:", err);
      } finally {
        setLoadingLoans(false);
      }
    };

    if (id) {
      fetchBook();
      fetchLoans();
    }
  }, [id]);

  const handleBorrow = async () => {
    if (!book || !user) return;

    setBorrowing(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(`Empréstimo de "${book.title}" realizado com sucesso`);
    setBook((prev) =>
      prev ? { ...prev, availableQuantity: prev.available - 1 } : null
    );

    setBorrowing(false);
  };

  const handleDelete = async () => {
    if (!book) return;

    // Verifica se o livro está emprestado
    const isBorrowed = book.available < book.quantity;

    if (isBorrowed) {
      toast.error(
        `O livro "${book.title}" está emprestado e não pode ser excluído.`
      );
      return;
    }

    setDeleting(true);

    try {
      await booksAPI.delete(book.id);
      toast.success(`Livro "${book.title}" excluído com sucesso`);
      navigate("/catalog");
    } catch (error) {
      toast.error("Erro ao excluir o livro.");
      console.error("Erro na exclusão:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Carregando detalhes do livro...
          </p>
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

  const isAvailable = book.available > 0;

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
              <h2 className="text-xl text-muted-foreground mb-4">
                por {book.author}
              </h2>

              <Badge
                className={`py-1 px-2 ${
                  isAvailable
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-destructive hover:bg-destructive/90"
                }`}
              >
                {isAvailable ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Disponível ({book.available})
                  </span>
                ) : (
                  <span>Indisponível</span>
                )}
              </Badge>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">
                  {book.description || "Sem descrição disponível."}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Detalhes</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium">ISBN</dt>
                  <dd className="text-muted-foreground">{book.isbn}</dd>

                  <dt className="font-medium">Total de Exemplares</dt>
                  <dd className="text-muted-foreground">{book.quantity}</dd>

                  {/*<dd className={`${isAvailable ? 'text-green-600' : 'text-destructive'} font-medium`}>*/}
                  {/*  {book.availableQuantity}*/}
                  {/*</dd>*/}
                </dl>
              </div>

              <Separator />

              {isLibrarianOrAdmin && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Histórico de Empréstimos
                  </h3>

                  {loadingLoans ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                      Carregando histórico...
                    </div>
                  ) : bookLoans.length === 0 ? (
                    <div className="border rounded-md">
                      <div className="p-4 text-center text-muted-foreground">
                        <p>
                          Nenhum registro de empréstimo encontrado para este
                          livro.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted text-left">
                            <th className="px-4 py-2 font-medium">Usuário</th>
                            <th className="px-4 py-2 font-medium">
                              Data de Empréstimo
                            </th>
                            <th className="px-4 py-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookLoans.map((loan: Loan) => (
                            <tr key={loan.id} className="border-t">
                              <td className="px-4 py-2">
                                {loan.person?.name || "Desconhecido"}
                              </td>
                              <td className="px-4 py-2">
                                {new Date(loan.start_date).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </td>
                              <td className="px-4 py-2">
                                <Badge
                                  className={`${
                                    loan.type === "RETURNED"
                                      ? "bg-green-500"
                                      : loan.type === "OVERDUE"
                                      ? "bg-yellow-500"
                                      : "bg-primary"
                                  }`}
                                >
                                  {loan.type === "RETURNED"
                                    ? "Retornado"
                                    : loan.type === "OVERDUE"
                                    ? "Atrasado"
                                    : "Ativo"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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
                        <Button
                          variant="outline"
                          className="justify-start text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir Livro
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá
                            permanentemente o livro "{book.title}" e todos os
                            registros de empréstimo associados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDelete}
                            disabled={deleting}
                          >
                            {deleting ? "Excluindo..." : "Excluir"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <>
                    {isLibrarianOrAdmin && (
                      <Button
                        className="justify-start"
                        disabled={!isAvailable || borrowing}
                        onClick={handleBorrow}
                      >
                        <BookCopy className="h-4 w-4 mr-2" />
                        {borrowing ? "Processando..." : "Emprestar Livro"}
                      </Button>
                    )}
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
