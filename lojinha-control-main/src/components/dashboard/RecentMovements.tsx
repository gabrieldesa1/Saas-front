import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { ApiStockMovement } from "@/types/api-stock-movement";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentMovementsProps {
  movements: ApiStockMovement[];
}

export function RecentMovements({ movements }: RecentMovementsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Movimentações Recentes</h3>
        <button className="text-sm text-primary hover:underline">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {movements.map((movement, index) => (
          <div
            key={movement.id}
            className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 transition-colors hover:bg-secondary/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                movement.type === "entrada"
                  ? "bg-success/20 text-success"
                  : "bg-destructive/20 text-destructive"
              )}
            >
              {movement.type === "entrada" ? (
                <ArrowDownLeft className="h-5 w-5" />
              ) : (
                <ArrowUpRight className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {movement.product_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {movement.reason}
              </p>
            </div>

            <div className="text-right">
              <p
                className={cn(
                  "font-semibold",
                  movement.type === "entrada"
                    ? "text-success"
                    : "text-destructive"
                )}
              >
                {movement.type === "entrada" ? "+" : "-"}
                {movement.quantity} un
              </p>
              <p className="text-xs text-muted-foreground">
                {format(
                  new Date(movement.created_at),
                  "dd MMM, HH:mm",
                  { locale: ptBR }
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
