import toast from 'react-hot-toast';
import { useAddCartItemMutation } from '@/features/cart/cartApi';
import { addLocalItem } from '@/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import type { Product } from '@/types/product';

export function useCartActions() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [addCartItem, addState] = useAddCartItemMutation();

  const addToCart = async (product: Product, quantity = 1) => {
    dispatch(addLocalItem({ productId: product.id, quantity, product }));

    if (accessToken) {
      try {
        await addCartItem({ productId: product.id, quantity }).unwrap();
      } catch {
        toast.error('Saved locally, but could not sync cart with server');
        return;
      }
    }

    toast.success('Added to cart');
  };

  return { addToCart, isAdding: addState.isLoading };
}
