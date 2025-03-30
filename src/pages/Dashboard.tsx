import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Book,
  BookCopy,
  BookOpen,
  CheckSquare,
  Clock,
  UserRound,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loansAPI, summaryAPI, usersAPI } from "@/services/api";
import {
  Loan,
  RecentActivityResponse,
  RecentActivityTypeEnum,
  SummaryResponse,
} from "@/types";

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const isLibrarian = hasRole(["LIBRARIAN", "ADMIN"]);

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [recentActivities, setRecentActivities] = useState<
    RecentActivityResponse[]
  >([]);
  const [readerLoans, setReaderLoans] = useState<Loan[]>([]);
  const [loadingReaderLoans, setLoadingReaderLoans] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return sevenDaysAgo;
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      const today = new Date();
      const maximumDate = today.toISOString().split("T")[0];
      const minimumDate = selectedDate.toISOString();

      if (isLibrarian) {
        setLoadingSummary(true);
        setLoadingActivity(true);

        try {
          const [summaryData, activityRaw] = await Promise.all([
            summaryAPI.getAll(),
            loansAPI.getActivity({
              maximum_date: maximumDate,
              page: 0,
              limit: 10000,
            }),
          ]);

          const recent = activityRaw.filter(
            (item) => new Date(item.created_at) >= new Date(minimumDate)
          );

          setSummary(summaryData);
          setRecentActivities(recent);
        } catch (error) {
          toast.error("Erro ao carregar dados do dashboard");
          console.error(error);
        } finally {
          setLoadingSummary(false);
          setLoadingActivity(false);
        }
      }
    };

    if (user) loadDashboardData();
  }, [isLibrarian, user?.id, selectedDate]);

  useEffect(() => {
    const loadReaderLoans = async () => {
      if (!isLibrarian && user?.id) {
        try {
          const data = await usersAPI.getLoanByUser(user.id);
          setReaderLoans(data);
        } catch (error) {
          toast.error("Erro ao carregar seus empréstimos");
          console.error(error);
        } finally {
          setLoadingReaderLoans(false);
        }
      }
    };

    loadReaderLoans();
  }, [isLibrarian, user?.id]);

  const handleQuickAction = (action: string) => {
    toast.success(`${action} action initiated successfully!`);
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1>Olá, {user?.name}</h1>
          </div>
        </div>

        {/* Stats overview */}
        {isLibrarian && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total de Livros */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de Livros
                  </p>
                  <h3 className="text-3xl font-bold mt-1">
                    {loadingSummary ? "..." : summary?.total_books ?? 0}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>

            {/* Empréstimos ativos */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Empréstimos Ativos
                  </p>
                  <h3 className="text-3xl font-bold mt-1">
                    {loadingSummary ? "..." : summary?.active_loans_count ?? 0}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookCopy className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>

            {/* Total de Leitores */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Leitores
                  </p>
                  <h3 className="text-3xl font-bold mt-1">
                    {loadingSummary ? "..." : summary?.readers_count ?? 0}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>

            {/* Empréstimos Atrasados */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Atrasados
                  </p>
                  <h3 className="text-3xl font-bold mt-1">
                    {loadingSummary ? "..." : summary?.overdue_loans_count ?? 0}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reader's content */}
        {!isLibrarian && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookCopy className="h-5 w-5 mr-2" />
                  <Link
                    to="/loans"
                    className="hover:underline text-primary font-semibold"
                  >
                    Ver meus empréstimos
                  </Link>
                </CardTitle>
              </CardHeader>

              {/* <CardContent>
                {mockLoans.length > 0 ? (
                  <ul className="space-y-3">
                    {mockLoans.map((loan) => (
                      <li
                        key={loan.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              loan.status === "overdue"
                                ? "bg-destructive"
                                : "bg-primary"
                            }`}
                          ></div>
                          <span className="font-medium">{loan.bookTitle}</span>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-sm ${
                              loan.status === "overdue"
                                ? "text-destructive"
                                : "text-muted-foreground"
                            }`}
                          >
                            Due: {new Date(loan.dueDate).toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={() => handleQuickAction("Renew")}
                          >
                            Renew
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>You don't have any active loans</p>
                    <Button variant="outline" className="mt-3" asChild>
                      <Link to="/catalog">Browse Books</Link>
                    </Button>
                  </div>
                )}
              </CardContent> */}
            </Card>
          </div>
        )}

        {/* Librarian's content */}
        {isLibrarian && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <div className="px-6 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div>
                  <label
                    htmlFor="activity-date"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Mostrar atividades de:
                  </label>
                  <span className="block sm:inline text-xs text-muted-foreground sm:ml-2">
                    (Da data selecionada até hoje)
                  </span>
                </div>
                <input
                  id="activity-date"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  className="border rounded px-2 py-1 text-sm bg-white text-black dark:bg-zinc-900 dark:text-white dark:border-zinc-700"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>

              <CardContent>
                {loadingActivity ? (
                  <p className="text-muted-foreground text-sm">
                    Carregando atividades...
                  </p>
                ) : recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const { activity: type, loan, created_at, id } = activity;

                      const isReturn =
                        type === RecentActivityTypeEnum.LOAN_RETURNED;
                      const isExtend =
                        type === RecentActivityTypeEnum.LOAN_EXTENDED;

                      const icon = isReturn ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <BookCopy className="h-4 w-4" />
                      );

                      const colorClass = isReturn
                        ? "bg-green-100 text-green-600"
                        : isExtend
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600";

                      const activityText =
                        type === RecentActivityTypeEnum.LOAN_CREATED
                          ? "emprestado"
                          : type === RecentActivityTypeEnum.LOAN_RETURNED
                          ? "devolvido"
                          : "estendido";

                      return (
                        <div key={id} className="flex items-start space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}
                          >
                            {icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              Livro <strong>"{loan.book.title}"</strong> foi{" "}
                              <strong>{activityText}</strong>{" "}
                              {type === RecentActivityTypeEnum.LOAN_RETURNED
                                ? "por"
                                : "para"}{" "}
                              <strong>{loan.person.name}</strong>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma atividade recente encontrada.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick actions */}
      </div>
    </Layout>
  );
};

export default Dashboard;
