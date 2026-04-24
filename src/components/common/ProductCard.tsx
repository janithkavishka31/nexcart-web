import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { toggleWishlistItem, selectIsInWishlist } from '@/features/wishlist/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useCartActions } from '@/hooks/useCartActions';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/format';
import { getProductImage } from '@/utils/productMedia';
import toast from 'react-hot-toast';

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const { addToCart, isAdding } = useCartActions();
  const isWishlisted = useAppSelector(selectIsInWishlist(product.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="group h-full overflow-hidden p-0">
        <Link
          to={`/products/${product.id}`}
          className="block overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800"
        >
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src =
                'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80';
            }}
          />
        </Link>
        <div className="space-y-4 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                {product.category?.name ?? 'Featured'}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-amber-500">
                <Star className="size-4 fill-current" />
                {product.rating ?? 4.5}
              </span>
            </div>
            <Link
              to={`/products/${product.id}`}
              className="text-lg font-semibold text-slate-950 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
            >
              {product.name}
            </Link>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl font-bold text-slate-950 dark:text-white">
              {formatCurrency(Number(product.price))}
            </span>
            <div className="flex gap-2">
              <Button
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                variant={isWishlisted ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  dispatch(toggleWishlistItem(product));
                  toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                }}
              >
                <Heart className={`size-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button size="sm" disabled={isAdding} onClick={() => addToCart(product)}>
                <ShoppingCart className="size-4" /> Add
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
