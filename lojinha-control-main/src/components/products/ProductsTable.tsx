import { useState } from "react";
import { Product } from "@/types/inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUpDown,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [sortBy, setSortBy] = useState<
    "name" | "quantity" | "price"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedProducts = [...products].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const handleSort = (column: "name" | "quantity" | "price") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity <= 0) {
      return { label: "Sem estoque", variant: "destructive" as const };
    }

    if (product.quantity <= product.minStock) {
      return { label: "Baixo", variant: "warning" as const };
    }

    return { label: "Normal", variant: "success" as const };
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30">
            <TableHead className="w-12">#</TableHead>

            <TableHead>
              <button
                onClick={() => handleSort("name")}
                className="flex items-center gap-2"
              >
                Produto
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>

            <TableHead>SKU</TableHead>
            <TableHead>Categoria</TableHead>

            <TableHead className="text-center">
              <button
                onClick={() => handleSort("quantity")}
                className="flex items-center gap-2 mx-auto"
              >
                Estoque
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="text-right">
              <button
                onClick={() => handleSort("price")}
                className="flex items-center gap-2 ml-auto"
              >
                Preço
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>

            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedProducts.map((product, index) => {
            const status = getStockStatus(product);

            return (
              <TableRow key={product.id}>
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Custo: {formatCurrency(product.cost)}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-mono text-sm text-muted-foreground">
                  {product.sku}
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">
                    {product.category ?? "—"}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <span
                    className={cn(
                      "font-semibold",
                      product.quantity <= product.minStock &&
                        "text-destructive"
                    )}
                  >
                    {product.quantity}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    / {product.minStock}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      status.variant === "success"
                        ? "default"
                        : status.variant === "warning"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {status.label}
                  </Badge>
                </TableCell>

                <TableCell className="text-right font-semibold">
                  {formatCurrency(product.price)}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onDelete?.(product)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
