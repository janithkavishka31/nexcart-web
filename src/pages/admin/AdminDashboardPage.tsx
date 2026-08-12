import { Card } from '@/components/ui/Card';

import {
  useListAdminOrdersQuery,
  useListAdminProductsQuery,
  useListAdminUsersQuery,
} from '@/features/admin/adminApi';

export default function AdminDashboardPage() {
  const users = useListAdminUsersQuery();
  const products = useListAdminProductsQuery();
  const orders = useListAdminOrdersQuery();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <p className="text-sm text-slate-500">Users</p>
        <strong className="mt-2 block text-3xl">{users.data?.data?.length ?? 0}</strong>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Products</p>
        <strong className="mt-2 block text-3xl">{products.data?.data?.length ?? 0}</strong>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Orders</p>
        <strong className="mt-2 block text-3xl">{orders.data?.data?.length ?? 0}</strong>
      </Card>
    </div>
  );
}
