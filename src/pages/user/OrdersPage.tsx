import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/Table';
import { useListOrdersQuery } from '@/features/orders/ordersApi';
import type { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/utils/format';
const columns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'Order' },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: ({ row }) => formatCurrency(Number(row.original.totalAmount)),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];
export default function OrdersPage() {
  const { data, isLoading } = useListOrdersQuery({ limit: 10 });

  if (isLoading) {
    return <div className="text-sm text-slate-500 py-4">Loading orders...</div>;
  }

  const orders = data?.data ?? [];
  return <DataTable columns={columns} data={orders} />;
}

