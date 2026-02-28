import { forwardRef } from 'react';

import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block space-y-2" htmlFor={inputId}>
        {label ? (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'focus-ring h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
            error && 'border-rose-400 focus-visible:ring-rose-500',
            className,
          )}
          {...props}
        />
        {error ? <span className="text-sm text-rose-600">{error}</span> : null}
      </label>
    );
  },
);

Input.displayName = 'Input';
