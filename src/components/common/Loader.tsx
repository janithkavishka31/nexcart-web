export function Loader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
      <div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-400" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
