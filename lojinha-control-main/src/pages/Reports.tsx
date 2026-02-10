import { AppLayout } from "@/components/layout/AppLayout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
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

const monthlyData = [
  { month: "Jan", entradas: 120, saidas: 95 },
  { month: "Fev", entradas: 98, saidas: 110 },
  { month: "Mar", entradas: 145, saidas: 130 },
  { month: "Abr", entradas: 165, saidas: 125 },
  { month: "Mai", entradas: 132, saidas: 140 },
  { month: "Jun", entradas: 178, saidas: 155 },
];

const categoryData = [
  { name: "Eletrônicos", value: 45890 },
  { name: "Roupas", value: 32450 },
  { name: "Alimentos", value: 28900 },
  { name: "Cosméticos", value: 19800 },
  { name: "Acessórios", value: 12500 },
];

const trendData = [
  { day: "Seg", valor: 12500 },
  { day: "Ter", valor: 15200 },
  { day: "Qua", valor: 11800 },
  { day: "Qui", valor: 18900 },
  { day: "Sex", valor: 22400 },
  { day: "Sáb", valor: 28100 },
  { day: "Dom", valor: 14200 },
];

export default function Reports() {
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

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-bold mt-2">R$ 127.450</p>
            <p className="text-xs text-success mt-1">+12.5% vs mês anterior</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Giro de Estoque</p>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-bold mt-2">3.2x</p>
            <p className="text-xs text-success mt-1">+0.4 vs mês anterior</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Margem Média</p>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold mt-2">52%</p>
            <p className="text-xs text-destructive mt-1">-2% vs mês anterior</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Produtos Ativos</p>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-bold mt-2">355</p>
            <p className="text-xs text-success mt-1">+18 novos este mês</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Movements Chart */}
          <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up">
            <h3 className="text-lg font-semibold mb-6">Movimentações Mensais</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(220, 10%, 55%)" />
                  <YAxis stroke="hsl(220, 10%, 55%)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(220, 18%, 10%)", 
                      border: "1px solid hsl(220, 15%, 18%)",
                      borderRadius: "0.75rem"
                    }}
                  />
                  <Bar dataKey="entradas" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saidas" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Saídas</span>
              </div>
            </div>
          </div>

          {/* Value by Category */}
          <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h3 className="text-lg font-semibold mb-6">Valor por Categoria</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                  <XAxis type="number" stroke="hsl(220, 10%, 55%)" />
                  <YAxis dataKey="name" type="category" stroke="hsl(220, 10%, 55%)" width={100} />
                  <Tooltip 
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                    contentStyle={{ 
                      backgroundColor: "hsl(220, 18%, 10%)", 
                      border: "1px solid hsl(220, 15%, 18%)",
                      borderRadius: "0.75rem"
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <h3 className="text-lg font-semibold mb-6">Tendência Semanal de Vendas</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                  <XAxis dataKey="day" stroke="hsl(220, 10%, 55%)" />
                  <YAxis stroke="hsl(220, 10%, 55%)" />
                  <Tooltip 
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                    contentStyle={{ 
                      backgroundColor: "hsl(220, 18%, 10%)", 
                      border: "1px solid hsl(220, 15%, 18%)",
                      borderRadius: "0.75rem"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="hsl(160, 84%, 39%)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
