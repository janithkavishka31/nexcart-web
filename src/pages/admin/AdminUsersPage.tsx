import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/Table';

import { useListAdminUsersQuery } from '@/features/admin/adminApi';

import type { User } from '@/types/auth';

const demoUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@nexcart.dev', role: 'ADMIN' },
  { id: '2', name: 'Seller User', email: 'seller@nexcart.dev', role: 'SELLER' },
];

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
];

export default function AdminUsersPage() {
  const { data } = useListAdminUsersQuery();
  return <DataTable columns={columns} data={data?.data?.length ? data.data : demoUsers} />;
}
