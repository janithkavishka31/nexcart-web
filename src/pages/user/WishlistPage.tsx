import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductCard } from '@/components/common/ProductCard';
import { useAppSelector } from '@/hooks/reduxHooks';

export default function WishlistPage() {
  const items = useAppSelector((state) => state.wishlist.items);

  if (!items.length) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart icon on any product to save it here for later."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{items.length} saved items</p>
        <Link
          to="/products"
          className="focus-ring inline-flex h-9 items-center rounded-xl border border-slate-200 px-3 text-sm font-semibold dark:border-slate-700"
        >
          Browse products
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
