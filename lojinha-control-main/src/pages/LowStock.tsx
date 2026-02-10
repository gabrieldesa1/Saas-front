import { AppLayout } from "@/components/layout/AppLayout";
import { useProducts } from "@/hooks/useProducts";
import { AlertTriangle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LowStock() {
  const { data: products = [], isLoading } = useProducts();

  const lowStockProducts = products.filter(
    (p) => p.quantity <= p.minStock
  );

  const criticalProducts = lowStockProducts.filter(
    (p) => p.quantity <= p.minStock * 0.5
  );

  const warningProducts = lowStockProducts.filter(
    (p) => p.quantity > p.minStock * 0.5
  );

  if (isLoading) {
    return (
      <AppLayout>
        <p>Carregando...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Estoque Baixo</h1>
            <p className="text-muted-foreground mt-1">
              Produtos que precisam de reposição
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crítico</p>
                <p className="text-2xl font-bold text-destructive">
                  {criticalProducts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-warning/20 bg-warning/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Atenção</p>
                <p className="text-2xl font-bold text-warning">
                  {warningProducts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">
                  {lowStockProducts.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        {lowStockProducts.length === 0 ? (
          <div className="rounded-2xl border border-success/20 bg-success/5 p-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/20 mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Tudo em ordem!</h3>
            <p className="text-muted-foreground">
              Todos os produtos estão com estoque adequado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {lowStockProducts.map((product, index) => {
              const percentage =
                (product.quantity / product.minStock) * 100;

              const isCritical = percentage <= 50;

              return (
                <div
                  key={product.id}
                  className={cn(
                    "rounded-2xl border p-6",
                    isCritical
                      ? "border-destructive/20 bg-destructive/5"
                      : "border-warning/20 bg-warning/5"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-xl",
                          isCritical
                            ? "bg-destructive/20"
                            : "bg-warning/20"
                        )}
                      >
                        <Package
                          className={cn(
                            "h-7 w-7",
                            isCritical
                              ? "text-destructive"
                              : "text-warning"
                          )}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">
                            {product.name}
                          </h3>
                          <Badge
                            variant={
                              isCritical ? "destructive" : "secondary"
                            }
                          >
                            {isCritical ? "Crítico" : "Baixo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku} • {product.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span
                            className={cn(
                              "font-semibold",
                              isCritical
                                ? "text-destructive"
                                : "text-warning"
                            )}
                          >
                            {product.quantity} un
                          </span>
                          <span className="text-muted-foreground">
                            / {product.minStock}
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className={cn(
                            "h-2",
                            isCritical
                              ? "bg-destructive/20"
                              : "bg-warning/20"
                          )}
                        />
                      </div>

                      <Button variant="outline" className="gap-2">
                        Repor
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
