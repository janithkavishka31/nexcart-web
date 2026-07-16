import { Card } from '@/components/ui/Card';

import { fallbackProducts } from '@/data/mockData';

import { useListMyProductsQuery } from '@/features/products/productsApi';

export default function SellerInventoryPage() {
  const { data } = useListMyProductsQuery();
  const products = data?.data?.length ? data.data : fallbackProducts;
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">{product.name}</h2>
            <p className="text-sm text-slate-500">Inventory health</p>
          </div>
          <span
            className={
              product.stock < 10 ? 'font-bold text-rose-600' : 'font-bold text-emerald-600'
            }
          >
            {product.stock} in stock
          </span>
        </Card>
      ))}
    </div>
  );
}
