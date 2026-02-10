import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Category } from "@/types/category";

interface CategoryChartProps {
  categories: Category[];
}

export function CategoryChart({ categories }: CategoryChartProps) {
  const data = categories.map(cat => ({
    name: cat.name,
    value: cat.productCount,
    color: cat.color,
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-6">Produtos por Categoria</h3>
      <div className="flex items-center gap-6">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(220, 18%, 10%)", 
                  border: "1px solid hsl(220, 15%, 18%)",
                  borderRadius: "0.75rem",
                  padding: "8px 12px"
                }}
                labelStyle={{ color: "hsl(220, 10%, 95%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <span className="flex-1 text-sm">{category.name}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {category.productCount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
