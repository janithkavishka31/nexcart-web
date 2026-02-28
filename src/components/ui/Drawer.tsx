import { X } from 'lucide-react';

import { Button } from './Button';

import { cn } from '@/utils/cn';

export function Drawer({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('fixed inset-0 z-40 md:hidden', !isOpen && 'pointer-events-none')}>
      <button
        aria-label="Close navigation"
        className={cn(
          'absolute inset-0 bg-slate-950/50 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white p-4 shadow-2xl transition-transform dark:bg-slate-950',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-4 flex justify-end">
          <Button variant="ghost" size="sm" aria-label="Close menu" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        {children}
      </aside>
    </div>
  );
}
