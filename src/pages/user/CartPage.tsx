import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/common/EmptyState';

import { Button } from '@/components/ui/Button';

import { Card } from '@/components/ui/Card';

import { removeLocalItem } from '@/features/cart/cartSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

import { formatCurrency } from '@/utils/format';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);
  return (
    <section className="container-page space-y-6 py-12">
      <h1 className="text-4xl font-black text-slate-950 dark:text-white">Cart</h1>
      {!items.length ? (
        <EmptyState
          title="Your cart is empty"
          description="Add products from the catalog to start checkout."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.productId} className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-950 dark:text-white">
                    {item.product?.name ?? item.productId}
                  </h2>
                  <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {formatCurrency((item.product?.price ?? 0) * item.quantity)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(removeLocalItem(item.productId))}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Card className="h-fit">
            <h2 className="text-xl font-bold">Summary</h2>
            <div className="my-6 flex justify-between text-lg">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <Link
              to="/checkout"
              className="focus-ring inline-flex h-11 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white"
            >
              Checkout
            </Link>
          </Card>
        </div>
      )}
    </section>
  );
}
