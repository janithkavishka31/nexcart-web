import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ErrorState } from '@/components/common/ErrorState';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useGetProductQuery } from '@/features/products/productsApi';
import { toggleWishlistItem, selectIsInWishlist } from '@/features/wishlist/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useCartActions } from '@/hooks/useCartActions';
import { fallbackProducts } from '@/data/mockData';
import { formatCurrency } from '@/utils/format';
import { getProductGallery, getProductImage } from '@/utils/productMedia';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80';

export default function ProductDetailsPage() {
  const { productId = '' } = useParams();
  const dispatch = useAppDispatch();
  const { addToCart, isAdding } = useCartActions();
  const isWishlisted = useAppSelector(selectIsInWishlist(productId));
  const { data, isLoading, isError } = useGetProductQuery(productId, {
    skip: productId.startsWith('demo-'),
  });
  const product = data?.data ?? fallbackProducts.find((item) => item.id === productId);
  const gallery = product ? getProductGallery(product) : [];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [productId]);

  if (isLoading) return <Loader label="Loading product" />;
  if (!product) {
    return (
      <section className="container-page py-12">
        <ErrorState title="Product not found" />
      </section>
    );
  }

  const selectedImage = gallery[activeImage] ?? getProductImage(product);

  return (
    <section className="container-page grid gap-10 py-12 lg:grid-cols-2">
      {isError ? (
        <div className="lg:col-span-2">
          <ErrorState
            title="Could not load product details"
            description="Some information may be out of date."
          />
        </div>
      ) : null}
      <div className="space-y-4">
        <Card className="p-3">
          <img
            src={selectedImage}
            alt={product.name}
            className="aspect-square w-full rounded-2xl object-cover"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </Card>
        {gallery.length > 1 ? (
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                className={`overflow-hidden rounded-2xl border-2 transition ${activeImage === index ? 'border-indigo-600' : 'border-transparent'}`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={image}
                  alt=""
                  className="aspect-square w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
            {product.category?.name ?? 'Product'}
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-amber-500">
            <Star className="size-5 fill-current" /> {product.rating ?? 4.5} customer rating
          </div>
        </div>
        <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
          {product.description}
        </p>
        <p className="text-4xl font-black text-slate-950 dark:text-white">
          {formatCurrency(Number(product.price))}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" disabled={isAdding} onClick={() => addToCart(product)}>
            <ShoppingCart className="size-5" /> Add to cart
          </Button>
          <Button
            size="lg"
            variant={isWishlisted ? 'primary' : 'outline'}
            onClick={() => {
              dispatch(toggleWishlistItem(product));
              toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
            }}
          >
            <Heart className={`size-5 ${isWishlisted ? 'fill-current' : ''}`} />
            {isWishlisted ? 'Wishlisted' : 'Add to wishlist'}
          </Button>
        </div>
      </div>
    </section>
  );
}
