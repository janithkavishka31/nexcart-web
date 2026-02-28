import { Menu, Moon, ShoppingCart, Sun } from 'lucide-react';

import { Link, NavLink } from 'react-router-dom';

import { publicNavigation } from '@/constants/navigation';

import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

import { Button } from '@/components/ui/Button';

import { setTheme, toggleMobileMenu } from '@/features/ui/uiSlice';

import { useLogoutUserMutation } from '@/features/auth/authApi';

export function Navbar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const theme = useAppSelector((state) => state.ui.theme);
  const [logoutUser] = useLogoutUserMutation();
  const cartCount = items.reduce((t, i) => t + i.quantity, 0);
  const dashboardHref =
    user?.role === 'ADMIN' ? '/admin' : user?.role === 'SELLER' ? '/seller' : '/dashboard';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <Link to="/" className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
            Nex<span className="text-indigo-600">Cart</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {publicNavigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-semibold text-indigo-600 dark:text-indigo-300'
                  : 'text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Link
            to="/cart"
            className="focus-ring relative inline-flex h-9 items-center justify-center rounded-xl px-3 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Cart"
          >
            <ShoppingCart className="size-5" />
            {cartCount ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-indigo-600 px-1.5 text-[10px] text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
          {user ? (
            <>
              <Link
                to={dashboardHref}
                className="focus-ring hidden h-9 items-center rounded-xl border border-slate-200 px-3 text-sm font-semibold dark:border-slate-700 sm:inline-flex"
              >
                Dashboard
              </Link>
              <Button variant="secondary" size="sm" onClick={() => logoutUser()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="focus-ring inline-flex h-9 items-center rounded-xl px-3 text-sm font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="focus-ring inline-flex h-9 items-center rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
