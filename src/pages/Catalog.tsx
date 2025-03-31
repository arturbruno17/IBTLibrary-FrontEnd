import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import BookCard from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, BookOpen, Loader2 } from "lucide-react";
import { Book, Role } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { booksAPI } from "@/services/api.ts";

const Catalog = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [limit] = useState(12);

  const fetchBooks = async (search: string = "") => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const response = await booksAPI.getAll(page, limit, search);
      setBooks(response);
      setFilteredBooks(response);
    } catch (error) {
      console.error("Erro ao carregar livros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setPage(0);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBooks(searchQuery);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, page]);

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1>Catálogo de Livros</h1>
          {hasRole([Role.LIBRARIAN, Role.ADMIN]) && (
            <Button onClick={() => navigate("/adicionar-livro")}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Livro
            </Button>
          )}
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar livros por título, autor ou ISBN..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Loader estilo Users */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando livros...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-xl font-medium mb-2">
              Nenhum livro encontrado
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `Nenhum livro corresponde a "${searchQuery}"`
                : "O catálogo da biblioteca está vazio"}
            </p>
          </div>
        )}

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
            disabled={filteredBooks.length < limit}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;
