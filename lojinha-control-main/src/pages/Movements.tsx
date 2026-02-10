import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useStockMovements } from "@/hooks/useStockMovements";
import { useCreateStockMovement } from "@/hooks/useCreateStockMovement";

export default function Movements() {
  const [open, setOpen] = useState(false);
  const [movementType, setMovementType] =
    useState<"entrada" | "saida">("entrada");
  const [searchQuery, setSearchQuery] = useState("");

  // estados do formulário
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const { data: products = [] } = useProducts();
  const { data, isLoading, refetch } = useStockMovements();
  const { mutateAsync: createMovement } = useCreateStockMovement();

  // dados da API (Laravel paginate)
  const movements = data?.data ?? [];

  const filteredMovements = movements.filter((movement: any) =>
    movement.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔥 AGORA SALVA DE VERDADE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !quantity) {
      toast({
        title: "Preencha os campos",
        description: "Produto e quantidade são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMovement({
        product_id: Number(selectedProduct),
        type: movementType,
        quantity: Number(quantity),
        reason: reason,
      });

      toast({
        title: "Movimentação registrada!",
        description: `A ${movementType} foi registrada com sucesso.`,
      });

      setOpen(false);
      setQuantity("");
      setReason("");
      setSelectedProduct("");

      // atualiza lista sem reload
      refetch();
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível registrar movimentação",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Movimentações</h1>
            <p className="text-muted-foreground mt-1">
              Registre entradas e saídas do estoque
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Movimentação
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Movimentação</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMovementType("entrada")}
                    className={cn(
                      "p-4 rounded-xl border",
                      movementType === "entrada"
                        ? "border-success bg-success/10"
                        : ""
                    )}
                  >
                    <ArrowDownLeft /> Entrada
                  </button>

                  <button
                    type="button"
                    onClick={() => setMovementType("saida")}
                    className={cn(
                      "p-4 rounded-xl border",
                      movementType === "saida"
                        ? "border-destructive bg-destructive/10"
                        : ""
                    )}
                  >
                    <ArrowUpRight /> Saída
                  </button>
                </div>

                <div>
                  <Label>Produto</Label>
                  <Select onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product: any) => (
                        <SelectItem key={product.id} value={String(product.id)}>
                          {product.name} ({product.quantity} em estoque)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  type="number"
                  placeholder="Quantidade"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <Textarea
                  placeholder="Motivo"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* LISTA */}
        <div className="rounded-xl border">
          {isLoading && (
            <p className="p-6 text-muted-foreground">Carregando...</p>
          )}

          {!isLoading && filteredMovements.length === 0 && (
            <p className="p-6 text-muted-foreground">
              Nenhuma movimentação registrada ainda.
            </p>
          )}

          {filteredMovements.map((mov: any) => (
            <div
              key={mov.id}
              className="flex items-center justify-between p-4 border-b"
            >
              <div>
                <p className="font-medium">{mov.product?.name}</p>
                <p className="text-sm text-muted-foreground">{mov.reason}</p>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={mov.type === "entrada" ? "default" : "destructive"}
                >
                  {mov.type}
                </Badge>

                <span className="font-bold">x{mov.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
