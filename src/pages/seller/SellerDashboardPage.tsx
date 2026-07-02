import { Card } from '@/components/ui/Card';

import { fallbackProducts } from '@/data/mockData';

import { useListMyProductsQuery } from '@/features/products/productsApi';

export default function SellerDashboardPage() {
  const { data } = useListMyProductsQuery({ limit: 8 });
  const products = data?.data?.length ? data.data : fallbackProducts;
  const lowStock = products.filter((product) => product.stock < 10).length;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <p className="text-sm text-slate-500">Listings</p>
        <strong className="mt-2 block text-3xl">{products.length}</strong>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Low stock</p>
        <strong className="mt-2 block text-3xl">{lowStock}</strong>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Open orders</p>
        <strong className="mt-2 block text-3xl">12</strong>
      </Card>
    </div>
  );
}
