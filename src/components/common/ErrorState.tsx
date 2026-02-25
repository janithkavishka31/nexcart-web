import { AlertTriangle } from 'lucide-react';

import { Card } from '@/components/ui/Card';

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again in a moment.',
}) {
  return (
    <Card className="border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-100">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5" />
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm opacity-80">{description}</p>
        </div>
      </div>
    </Card>
  );
}
