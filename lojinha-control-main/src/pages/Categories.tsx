import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";

const colorOptions = [
  { name: "Azul", value: "hsl(217, 91%, 60%)" },
  { name: "Roxo", value: "hsl(280, 87%, 65%)" },
  { name: "Laranja", value: "hsl(38, 92%, 50%)" },
  { name: "Rosa", value: "hsl(340, 82%, 52%)" },
  { name: "Verde", value: "hsl(160, 84%, 39%)" },
  { name: "Vermelho", value: "hsl(0, 84%, 60%)" },
  { name: "Ciano", value: "hsl(180, 70%, 45%)" },
  { name: "Amarelo", value: "hsl(50, 95%, 50%)" },
];

export default function Categories() {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [categoryName, setCategoryName] = useState("");

  const { data: categories = [] } = useCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // aqui depois você liga no POST /categories
    toast({
      title: "Categoria criada!",
      description: `${categoryName} foi adicionada com sucesso.`,
    });

    setOpen(false);
    setCategoryName("");
    setSelectedColor(colorOptions[0].value);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
            <p className="text-muted-foreground mt-1">
              Organize seus produtos em categorias
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Categoria</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Nome da Categoria</Label>
                  <Input
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Ex: Eletrônicos"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cor</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`h-8 w-8 rounded-lg transition-all ${
                          selectedColor === color.value
                            ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Criar Categoria</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.length === 0 && (
            <p className="text-muted-foreground">
              Nenhuma categoria cadastrada ainda.
            </p>
          )}

          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Package
                      className="h-7 w-7"
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.product_count ?? 0} produtos
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div
                className="mt-4 h-1 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
