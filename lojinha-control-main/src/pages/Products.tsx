import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductsTable } from "@/components/products/ProductsTable";
import { ProductFilters } from "@/components/products/ProductFilters";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { useProducts } from "@/hooks/useProducts";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { Package } from "lucide-react";
import { Product } from "@/types/inventory";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [products, searchQuery]);

  const handleDelete = (product: Product) => {
    if (!confirm(`Deseja excluir o produto "${product.name}"?`)) return;

    deleteProduct.mutate(Number(product.id)); // 👈 id NUMBER (API)
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie os produtos do estoque
            </p>
          </div>

          <AddProductDialog categories={[]} />
        </div>

        <ProductFilters
          categories={[]}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4" />
          {isLoading
            ? "Carregando produtos..."
            : `Mostrando ${filteredProducts.length} produtos`}
        </div>

        <ProductsTable
          products={filteredProducts}
          onDelete={handleDelete}
        />
      </div>
    </AppLayout>
  );
}
