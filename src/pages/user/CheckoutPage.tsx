import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAddCartItemMutation, useClearCartMutation } from '@/features/cart/cartApi';
import { clearLocalCart } from '@/features/cart/cartSlice';
import { usePlaceOrderMutation } from '@/features/orders/ordersApi';
import { useListAddressesQuery } from '@/features/users/usersApi';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import type { ShippingAddress } from '@/types/order';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(7, 'Phone is required'),
  line1: z.string().min(3, 'Address line is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(2, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const localItems = useAppSelector((state) => state.cart.items);
  const { data: addresses } = useListAddressesQuery();
  const [placeOrder, { isLoading: isPlacing }] = usePlaceOrderMutation();
  const [addCartItem] = useAddCartItemMutation();
  const [clearServerCart] = useClearCartMutation();

  const defaultAddress =
    addresses?.data?.find((address) => address.label === 'Home') ?? addresses?.data?.[0];

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name ?? '',
      phone: user?.phone ?? '+1-555-0100',
      line1: defaultAddress?.line1 ?? '742 Evergreen Terrace',
      line2: defaultAddress?.line2 ?? '',
      city: defaultAddress?.city ?? 'Springfield',
      state: 'IL',
      postalCode: defaultAddress?.postalCode ?? '62704',
      country: defaultAddress?.country ?? 'USA',
    },
  });

  async function syncLocalCartToServer() {
    await clearServerCart()
      .unwrap()
      .catch(() => undefined);

    for (const item of localItems) {
      await addCartItem({ productId: item.productId, quantity: item.quantity }).unwrap();
    }
  }

  async function onSubmit(values: CheckoutFormValues) {
    if (!localItems.length) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      await syncLocalCartToServer();

      const shippingAddress: ShippingAddress = {
        fullName: values.fullName,
        phone: values.phone,
        line1: values.line1,
        line2: values.line2 || undefined,
        city: values.city,
        state: values.state || undefined,
        postalCode: values.postalCode,
        country: values.country,
      };

      const response = await placeOrder({ shippingAddress }).unwrap();
      dispatch(clearLocalCart());
      toast.success(response.message || 'Order placed successfully');
      navigate('/dashboard/orders', { replace: true });
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      toast.error(
        apiError?.data?.message ?? 'Unable to place order. Log in and ensure your cart has items.',
      );
    }
  }

  const subtotal = localItems.reduce(
    (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
    0,
  );

  return (
    <section className="container-page max-w-3xl space-y-6 py-12">
      <h1 className="text-4xl font-black text-slate-950 dark:text-white">Checkout</h1>

      <Card>
        <h2 className="text-xl font-bold">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {localItems.map((item) => (
            <li key={item.productId} className="flex justify-between gap-4">
              <span>
                {item.product?.name ?? item.productId} × {item.quantity}
              </span>
              <span className="font-semibold">
                ${(Number(item.product?.price ?? 0) * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-lg font-bold">Total: ${subtotal.toFixed(2)}</p>
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-bold">Shipping address</h2>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Input
            label="Full name"
            {...form.register('fullName')}
            error={form.formState.errors.fullName?.message}
          />
          <Input
            label="Phone"
            {...form.register('phone')}
            error={form.formState.errors.phone?.message}
          />
          <Input
            label="Address line 1"
            {...form.register('line1')}
            error={form.formState.errors.line1?.message}
          />
          <Input label="Address line 2 (optional)" {...form.register('line2')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="City"
              {...form.register('city')}
              error={form.formState.errors.city?.message}
            />
            <Input label="State" {...form.register('state')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Postal code"
              {...form.register('postalCode')}
              error={form.formState.errors.postalCode?.message}
            />
            <Input
              label="Country"
              {...form.register('country')}
              error={form.formState.errors.country?.message}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isPlacing || !localItems.length}>
            {isPlacing ? 'Placing order...' : 'Place order'}
          </Button>
        </form>
      </Card>
    </section>
  );
}
