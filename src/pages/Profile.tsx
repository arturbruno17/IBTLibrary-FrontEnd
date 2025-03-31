
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { usersAPI, loansAPI } from "@/services/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loan } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LoanStatus } from "@/types";

// Define the form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const userId = user?.id.toString() || "";

  // Fetch user data
  const {
    data: userData,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersAPI.getById(userId),
    enabled: !!userId,
  });

  // Fetch user loans
  const { data: userLoans, isLoading: isLoadingLoans } = useQuery({
    queryKey: ["userLoans", userId],
    queryFn: () => loansAPI.getUserLoans(userId),
    enabled: !!userId,
  });

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData?.name || user?.name || "",
      email: userData?.email || user?.email || "",
    },
    values: {
      name: userData?.name || user?.name || "",
      email: userData?.email || user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    try {
      const updatedUser = await usersAPI.update(userId, data);
      updateUser(updatedUser);
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      refetchUser();
    } catch (error) {
      toast.error("Erro ao atualizar perfil.");
      console.error("Error updating profile:", error);
    }
  };

  const getLoanStatusText = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.PENDING:
        return "Pendente";
      case LoanStatus.CANCELED:
        return "Cancelado";
      case LoanStatus.EXTENDED:
        return "Estendido";
      case LoanStatus.IN_DAYS:
        return "Em dia";
      case LoanStatus.RETURNED:
        return "Devolvido";
      case LoanStatus.OVERDUE:
        return "Atrasado";
      default:
        return status;
    }
  };

  const getLoanStatusColor = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.PENDING:
        return "bg-yellow-500";
      case LoanStatus.CANCELED:
        return "bg-gray-500";
      case LoanStatus.EXTENDED:
        return "bg-blue-500";
      case LoanStatus.IN_DAYS:
        return "bg-green-500";
      case LoanStatus.RETURNED:
        return "bg-green-700";
      case LoanStatus.OVERDUE:
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">Usuário não encontrado</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Perfil do Usuário</h1>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="loans">Histórico de Empréstimos</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Visualize e edite suas informações de perfil
                    </CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingUser ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Seu nome"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="seu.email@exemplo.com"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel>Tipo de Usuário</FormLabel>
                        <FormDescription className="capitalize">
                          {user.role === "ADMIN"
                            ? "Administrador"
                            : user.role === "LIBRARIAN"
                            ? "Bibliotecário"
                            : "Leitor"}
                        </FormDescription>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        {!isEditing ? (
                          <Button
                            type="button"
                            onClick={() => setIsEditing(true)}
                          >
                            Editar Perfil
                          </Button>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                form.reset();
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button type="submit">
                              <Save className="mr-2 h-4 w-4" />
                              Salvar Alterações
                            </Button>
                          </>
                        )}
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Empréstimos</CardTitle>
                <CardDescription>
                  Visualize todos os seus empréstimos de livros
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLoans ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : userLoans && userLoans.length > 0 ? (
                  <div className="space-y-4">
                    {userLoans.map((loan: Loan) => (
                      <div
                        key={loan.id}
                        className="border rounded-lg p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <div>
                            <h3 className="font-medium text-lg">
                              {loan.book.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              por {loan.book.author}
                            </p>
                          </div>
                          <Badge
                            className={`${getLoanStatusColor(
                              loan.type
                            )} hover:${getLoanStatusColor(loan.type)}`}
                          >
                            {getLoanStatusText(loan.type)}
                          </Badge>
                        </div>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Data do empréstimo:</span>{" "}
                            {format(new Date(loan.start_date), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </div>
                          <div>
                            <span className="font-medium">
                              Data prevista de devolução:
                            </span>{" "}
                            {format(
                              new Date(
                                new Date(loan.start_date).setDate(
                                  new Date(loan.start_date).getDate() +
                                    loan.duration
                                )
                              ),
                              "dd/MM/yyyy",
                              { locale: ptBR }
                            )}
                          </div>
                          {loan.return_date && (
                            <div>
                              <span className="font-medium">
                                Data de devolução:
                              </span>{" "}
                              {format(
                                new Date(loan.return_date),
                                "dd/MM/yyyy",
                                { locale: ptBR }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                      Você ainda não possui nenhum empréstimo.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
