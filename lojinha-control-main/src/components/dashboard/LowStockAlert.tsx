import { AlertTriangle } from "lucide-react";
import { Product } from "@/types/inventory";
import { Progress } from "@/components/ui/progress";

interface LowStockAlertProps {
  products: Product[];
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  const lowStockProducts = products.filter(
    (p) => p.quantity <= p.minStock
  );

  if (lowStockProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up">
        <h3 className="text-lg font-semibold mb-4">Alertas de Estoque</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center mb-3">
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-muted-foreground">
            Todos os produtos estão com estoque adequado!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h3 className="text-lg font-semibold">Alertas de Estoque Baixo</h3>
        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
          {lowStockProducts.length}
        </span>
      </div>

      <div className="space-y-4">
        {lowStockProducts.slice(0, 4).map((product) => {
          const percentage =
            (product.quantity / product.minStock) * 100;

          return (
            <div key={product.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.sku}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive">
                    {product.quantity} un
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mín: {product.minStock}
                  </p>
                </div>
              </div>
              <Progress value={percentage} className="h-2 bg-destructive/20" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
