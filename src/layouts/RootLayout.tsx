import { Outlet } from 'react-router-dom';

import { Drawer } from '@/components/ui/Drawer';

import { Footer } from '@/components/layout/Footer';

import { Navbar } from '@/components/layout/Navbar';

import { Sidebar } from '@/components/layout/Sidebar';

import { closeMobileMenu } from '@/features/ui/uiSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

export function RootLayout() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <Drawer isOpen={isOpen} onClose={() => dispatch(closeMobileMenu())}>
        <Sidebar />
      </Drawer>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
