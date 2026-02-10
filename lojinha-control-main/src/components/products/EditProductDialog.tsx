import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import { Pencil } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  min_stock: number;
  price: string;
  cost: string;
}

interface EditProductDialogProps {
  product: Product;
}

export function EditProductDialog({ product }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync: updateProduct, isPending } = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    quantity: product.quantity,
    min_stock: product.min_stock,
    price: product.price,
    cost: product.cost,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProduct({
        id: product.id,
        ...formData,
        price: Number(formData.price),
        cost: Number(formData.cost),
      });

      toast({
        title: "Produto atualizado",
        description: `${formData.name} foi atualizado com sucesso.`,
      });

      setOpen(false);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label>SKU</Label>
            <Input
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Quantidade</Label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <Label>Estoque mínimo</Label>
            <Input
              type="number"
              value={formData.min_stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  min_stock: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <Label>Custo</Label>
            <Input
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Preço</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
