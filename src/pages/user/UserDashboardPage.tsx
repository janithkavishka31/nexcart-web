import { Card } from '@/components/ui/Card';
import { useListOrdersQuery } from '@/features/orders/ordersApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import { formatCurrency } from '@/utils/format';

export default function UserDashboardPage() {
  const { data, isLoading } = useListOrdersQuery({ limit: 5 });
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  if (isLoading) {
    return <div className="text-sm text-slate-500 py-4">Loading dashboard...</div>;
  }

  const orders = data?.data ?? [];


  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <p className="text-sm text-slate-500">Recent orders</p>
        <strong className="mt-2 block text-3xl">{orders.length}</strong>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Lifetime spend</p>
        <strong className="mt-2 block text-3xl">
          {formatCurrency(orders.reduce((sum, order) => sum + Number(order.totalAmount), 0))}
        </strong>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Wishlist items</p>
        <strong className="mt-2 block text-3xl">{wishlistCount}</strong>
      </Card>
    </div>
  );
}
