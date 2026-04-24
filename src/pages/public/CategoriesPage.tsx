import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/common/ErrorState';
import { Loader } from '@/components/common/Loader';

import { useListCategoriesQuery } from '@/features/products/productsApi';

import { getCategoryImage } from '@/utils/categoryMedia';

export default function CategoriesPage() {
  const { data, error, isLoading } = useListCategoriesQuery();
  const categories = data?.data ?? [];

  return (
    <section className="container-page space-y-8 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
          Browse
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Categories</h1>
      </div>

      {isLoading ? <Loader label="Loading categories..." /> : null}
      {error ? (
        <ErrorState
          description="We could not load categories right now."
          title="Failed to load categories"
        />
      ) : null}

      {!isLoading && !error && categories.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No categories available yet.</p>
      ) : null}

      {!isLoading && !error && categories.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${encodeURIComponent(category.name)}`}>
              <Card className="overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-md">
                <img
                  alt={category.name}
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                  src={getCategoryImage(category)}
                />
                <div className="p-5">
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">{category.name}</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {category.description ?? `Shop ${category.name} products.`}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
