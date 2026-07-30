import { Outlet } from 'react-router-dom';

import { Sidebar } from '@/components/layout/Sidebar';

import { Card } from '@/components/ui/Card';

import { useAppSelector } from '@/hooks/reduxHooks';

export function DashboardLayout() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <section className="container-page grid gap-6 py-8 md:grid-cols-[260px_1fr]">
      <aside className="hidden md:block">
        <Card className="sticky top-24 p-3">
          <Sidebar />
        </Card>
      </aside>
      <div className="min-w-0 space-y-6">
        <Card className="bg-gradient-to-br from-indigo-600 to-slate-900 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">
            {user?.role === 'ADMIN'
              ? 'Admin dashboard'
              : user?.role === 'SELLER'
                ? 'Seller dashboard'
                : 'My account'}
          </p>
          <h1 className="mt-2 text-3xl font-bold">Welcome back, {user?.name ?? 'there'}</h1>
          <p className="mt-2 max-w-2xl text-indigo-100">
            Manage your orders, profile, and listings from one place.
          </p>
        </Card>
        <Outlet />
      </div>
    </section>
  );
}
