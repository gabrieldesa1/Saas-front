import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
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
import { Product } from "@/types/inventory";

interface AddProductDialogProps {
  product?: Product | null;
  onSave?: (data: any) => Promise<void>;
  onClose?: () => void;
}

export function AddProductDialog({
  product,
  onSave,
  onClose,
}: AddProductDialogProps) {
  const isEditMode = !!product;

  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync: createProduct, isPending } = useCreateProduct();
  const { data: categories } = useCategories();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: "",
    minStock: "",
    price: "",
    cost: "", // unitário (salvo no banco)
    totalCost: "", // digitado pelo usuário
    categoryId: "",
  });

  // =============================
  // MODO EDIÇÃO
  // =============================
  useEffect(() => {
    if (product) {
      const totalCost =
        product.quantity && product.cost
          ? (product.quantity * product.cost).toFixed(2)
          : "";

      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        quantity: String(product.quantity ?? ""),
        minStock: String(product.minStock ?? ""),
        price: String(product.price ?? ""),
        cost: String(product.cost ?? ""),
        totalCost: totalCost,
        categoryId: String(product.categoryId ?? ""),
      });

      setOpen(true);
    }
  }, [product]);

  // =============================
  // CÁLCULO AUTOMÁTICO
  // =============================
  useEffect(() => {
    const quantity = Number(formData.quantity);
    const totalCost = Number(formData.totalCost);

    if (quantity > 0 && totalCost > 0) {
      const unitCost = (totalCost / quantity).toFixed(2);

      if (unitCost !== formData.cost) {
        setFormData((prev) => ({
          ...prev,
          cost: unitCost,
        }));
      }
    }
  }, [formData.quantity, formData.totalCost]);

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      quantity: "",
      minStock: "",
      price: "",
      cost: "",
      totalCost: "",
      categoryId: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      sku: formData.sku,
      quantity: Number(formData.quantity),
      min_stock: Number(formData.minStock),
      price: Number(formData.price),
      cost: Number(formData.cost), // continua unitário
      category_id: formData.categoryId
        ? Number(formData.categoryId)
        : null,
    };

    try {
      if (isEditMode && onSave) {
        await onSave(payload);
        toast({
          title: "Produto atualizado",
          description: `${formData.name} foi atualizado.`,
        });
      } else {
        await createProduct(payload);
        toast({
          title: "Produto criado",
          description: `${formData.name} foi adicionado ao estoque.`,
        });
      }

      setOpen(false);
      onClose?.();
      resetForm();
    } catch {
      toast({
        title: "Erro",
        description: isEditMode
          ? "Erro ao atualizar produto."
          : "Erro ao criar produto.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          onClose?.();
          resetForm();
        }
      }}
    >
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
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
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Estoque mínimo</Label>
            <Input
              type="number"
              value={formData.minStock}
              onChange={(e) =>
                setFormData({ ...formData, minStock: e.target.value })
              }
            />
          </div>

          {/* NOVO CAMPO */}
          <div>
            <Label>Custo total do lote</Label>
            <Input
              type="number"
              value={formData.totalCost}
              onChange={(e) =>
                setFormData({ ...formData, totalCost: e.target.value })
              }
            />
          </div>

          {/* AUTOMÁTICO */}
          <div>
            <Label>Custo unitário (automático)</Label>
            <Input type="number" value={formData.cost} disabled />
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

          <div>
            <Label>Categoria</Label>
            <select
              className="w-full bg-background border rounded-md p-2"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              <option value="">Sem categoria</option>
              {categories?.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending
              ? "Salvando..."
              : isEditMode
              ? "Salvar Alterações"
              : "Salvar Produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}