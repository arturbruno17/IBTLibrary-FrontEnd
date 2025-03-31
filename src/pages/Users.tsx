import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  User,
  UserRound,
  Mail,
  Copy,
  ArrowRight,
  Loader2,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usersAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = users.filter((user) => {
        const search = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
        );
      });
      setFilteredUsers(filtered);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await usersAPI.getAllUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Email copiado para a área de transferência!");
      })
      .catch((err) => {
        console.error("Falha ao copiar email: ", err);
        toast.error("Falha ao copiar email");
      });
  };

  const handleViewLoans = (userId: number | string) => {
    navigate(`/emprestimos?user=${userId}`);
  };

  return (
    <Layout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Usuários</CardTitle>
            <CardDescription>
              Gerencie os usuários da biblioteca.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar usuário por nome ou email..."
                  className="pl-10"
                  onChange={handleSearch}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando usuários...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {user.role === "ADMIN"
                            ? "Administrador"
                            : user.role === "LIBRARIAN"
                            ? "Bibliotecário"
                            : "Leitor"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Mail className="h-4 w-4 mr-2" />
                        {user.email}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto"
                          onClick={() => copyToClipboard(user.email)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="link"
                        className="mt-2 p-0"
                        onClick={() => handleViewLoans(user.id)}
                      >
                        Ver Empréstimos{" "}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserRound className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-xl font-medium mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-muted-foreground">
                  Não há usuários que correspondam à sua pesquisa.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;
