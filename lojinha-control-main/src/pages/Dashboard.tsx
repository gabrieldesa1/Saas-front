import { Package, DollarSign, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentMovements } from "@/components/dashboard/RecentMovements";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

export default function Dashboard() {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // ====== MÉTRICAS ======
  const totalProducts = products.length;

  const totalStockValue = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  const lowStockCount = products.filter(
    (product) => product.quantity <= product.minStock
  ).length;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu estoque e movimentações
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Produtos"
            value={totalProducts}
            icon={Package}
          />
          <StatCard
            title="Valor em Estoque"
            value={formatCurrency(totalStockValue)}
            icon={DollarSign}
            variant="success"
          />
          <StatCard
            title="Estoque Baixo"
            value={lowStockCount}
            icon={AlertTriangle}
            variant="danger"
          />
          <StatCard
            title="Movimentações Hoje"
            value={0}
            icon={ArrowLeftRight}
          />
        </div>

        {/* Main */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentMovements movements={[]} />
          </div>
          <div>
            <LowStockAlert products={products} />
          </div>
        </div>

        {/* Categories */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryChart categories={categories} />
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-6">Resumo Rápido</h3>
            <div className="space-y-4">
              <div className="flex justify-between p-4 rounded-xl bg-secondary/30">
                <span>Produtos cadastrados</span>
                <span className="font-semibold">{products.length}</span>
              </div>
              <div className="flex justify-between p-4 rounded-xl bg-secondary/30">
                <span>Categorias ativas</span>
                <span className="font-semibold">{categories.length}</span>
              </div>
              <div className="flex justify-between p-4 rounded-xl bg-secondary/30">
                <span>Margem média</span>
                <span className="font-semibold text-success">—</span>
              </div>
              <div className="flex justify-between p-4 rounded-xl bg-secondary/30">
                <span>Produtos sem estoque</span>
                <span className="font-semibold text-destructive">
                  {products.filter(p => p.quantity === 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
