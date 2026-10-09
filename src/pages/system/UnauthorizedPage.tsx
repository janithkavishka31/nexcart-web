import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';

export default function UnauthorizedPage() {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-12">
      <Card className="max-w-lg text-center">
        <h1 className="text-3xl font-black">Unauthorized</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          You do not have permission to view this page.
        </p>
        <Link
          to="/"
          className="focus-ring mt-6 inline-flex h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white"
        >
          Back home
        </Link>
      </Card>
    </section>
  );
}
