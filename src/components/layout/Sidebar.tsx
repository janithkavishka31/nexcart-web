import { NavLink } from 'react-router-dom';

import { roleNavigation } from '@/constants/navigation';

import { useAppSelector } from '@/hooks/reduxHooks';

import { cn } from '@/utils/cn';

export function Sidebar() {
  const role = useAppSelector((state) => state.auth.user?.role ?? 'USER');
  return (
    <nav className="space-y-2">
      {roleNavigation[role].map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.href}
            to={item.href}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              )
            }
          >
            <Icon className="size-5" /> {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
