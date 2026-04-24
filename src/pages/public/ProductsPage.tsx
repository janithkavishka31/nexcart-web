import { Search, X } from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { EmptyState } from '@/components/common/EmptyState';

import { ErrorState } from '@/components/common/ErrorState';

import { ProductCard } from '@/components/common/ProductCard';

import { Button } from '@/components/ui/Button';

import { Input } from '@/components/ui/Input';

import { Pagination } from '@/components/ui/Pagination';

import { useListCategoriesQuery, useListProductsQuery } from '@/features/products/productsApi';

import { fallbackProducts } from '@/data/mockData';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryName = searchParams.get('category')?.trim() ?? '';
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: categoriesData, isLoading: categoriesLoading } = useListCategoriesQuery();
  const selectedCategory = useMemo(
    () =>
      categoriesData?.data?.find(
        (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
      ),
    [categoriesData, categoryName],
  );

  const unknownCategory = Boolean(categoryName && !categoriesLoading && !selectedCategory);

  useEffect(() => {
    setPage(1);
  }, [categoryName, search]);

  const { data, isFetching, isError } = useListProductsQuery(
    {
      page,
      limit: 9,
      search: search || undefined,
      categoryId: selectedCategory?.id,
    },
    { skip: Boolean(categoryName && categoriesLoading) },
  );

  const products = useMemo(
    () => (data?.data?.length ? data.data : isError ? fallbackProducts : []),
    [data, isError],
  );

  function clearCategoryFilter() {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('category');
    setSearchParams(nextParams);
  }

  return (
    <section className="container-page space-y-8 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
          Catalog
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
          {selectedCategory ? selectedCategory.name : 'Discover products'}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {selectedCategory
            ? `Browse products in ${selectedCategory.name}.`
            : 'Search by name, filter by category, and find what you need.'}
        </p>
      </div>

      {selectedCategory ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            Category: {selectedCategory.name}
            <button
              aria-label="Clear category filter"
              className="rounded-full p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
              type="button"
              onClick={clearCategoryFilter}
            >
              <X className="size-4" />
            </button>
          </span>
          <Button size="sm" variant="outline" onClick={clearCategoryFilter}>
            View all products
          </Button>
        </div>
      ) : null}

      {unknownCategory ? (
        <ErrorState
          description={`No category named "${categoryName}" was found.`}
          title="Unknown category"
        />
      ) : null}

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-12"
          placeholder="Search products..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>
      {isError ? (
        <ErrorState
          title="Catalog temporarily unavailable"
          description="Showing sample products while we reconnect to the store."
        />
      ) : null}
      {isFetching ? <div className="text-sm text-slate-500">Refreshing products...</div> : null}
      {!unknownCategory && products.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
      {!unknownCategory && !isFetching && !products.length ? (
        <EmptyState
          title="No products found"
          description={
            selectedCategory
              ? `No products are listed in ${selectedCategory.name} yet.`
              : 'Try changing your search or category filters.'
          }
        />
      ) : null}
      {!unknownCategory ? (
        <Pagination page={page} totalPages={data?.meta?.totalPages ?? 1} onPageChange={setPage} />
      ) : null}
    </section>
  );
}
