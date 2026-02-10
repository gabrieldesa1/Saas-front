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
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateProduct } from "@/hooks/useCreateProduct";

interface AddProductDialogProps {
  categories: any[];
}

export function AddProductDialog({}: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync: createProduct, isPending } = useCreateProduct();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: "",
    minStock: "",
    price: "",
    cost: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProduct({
        name: formData.name,
        sku: formData.sku,
        quantity: Number(formData.quantity),
        min_stock: Number(formData.minStock),
        price: Number(formData.price),
        cost: Number(formData.cost),
        category_id: null,
      });

      toast({
        title: "Produto criado",
        description: `${formData.name} foi adicionado ao estoque.`,
      });

      setOpen(false);
      setFormData({
        name: "",
        sku: "",
        quantity: "",
        minStock: "",
        price: "",
        cost: "",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao criar produto.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div>
            <Label>SKU</Label>
            <Input value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
          </div>

          <div>
            <Label>Quantidade</Label>
            <Input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
          </div>

          <div>
            <Label>Estoque mínimo</Label>
            <Input type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} />
          </div>

          <div>
            <Label>Custo</Label>
            <Input type="number" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} />
          </div>

          <div>
            <Label>Preço</Label>
            <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Salvando..." : "Salvar Produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
