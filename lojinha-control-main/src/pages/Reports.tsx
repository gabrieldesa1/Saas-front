import { useEffect, useState, ReactElement, ReactNode } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Download, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportData {
  totalValue: number;
  stockTurnover: number;
  averageMargin: number;
  activeProducts: number;
  totalRevenue: number;

  monthlyData: { month: number; entradas: number; saidas: number }[];
  categoryData: { name: string; value: number }[];
  trendData: { day: string; valor: number }[];
}

export default function Reports() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          throw new Error("VITE_API_URL não definida no .env");
        }

        const response = await fetch(`${apiUrl}/api/reports`);

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result: ReportData = await response.json();

        setData(result);
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  // 🔥 Loading primeiro
  if (loading) {
    return (
      <AppLayout>
        <div className="p-6">Carregando...</div>
      </AppLayout>
    );
  }

  // 🔥 Depois erro
  if (!data) {
    return (
      <AppLayout>
        <div className="p-6 text-destructive">
          Erro ao carregar relatórios
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Análise e métricas do seu estoque
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select defaultValue="month">
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="quarter">Este trimestre</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Valor Total"
            value={`R$ ${data.totalValue.toLocaleString("pt-BR")}`}
            icon={<TrendingUp className="h-4 w-4 text-success" />}
          />

          <StatCard
            title="Giro de Estoque"
            value={`${data.stockTurnover}x`}
            icon={<TrendingUp className="h-4 w-4 text-success" />}
          />

          <StatCard
            title="Margem Média"
            value={`${data.averageMargin}%`}
            icon={<TrendingDown className="h-4 w-4 text-destructive" />}
          />

          <StatCard
            title="Produtos Ativos"
            value={data.activeProducts}
            icon={<TrendingUp className="h-4 w-4 text-success" />}
          />

          <StatCard
            title="Faturamento do Mês"
            value={`R$ ${data.totalRevenue.toLocaleString("pt-BR")}`}
            icon={<TrendingUp className="h-4 w-4 text-success" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Movimentações Mensais">
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="entradas" fill="#10b981" />
              <Bar dataKey="saidas" fill="#ef4444" />
            </BarChart>
          </ChartCard>

          <ChartCard title="Valor por Categoria">
            <BarChart data={data.categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ChartCard>

          <div className="lg:col-span-2">
            <ChartCard title="Tendência Semanal de Vendas">
              <AreaChart data={data.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#10b981"
                  fill="#10b981"
                />
              </AreaChart>
            </ChartCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}