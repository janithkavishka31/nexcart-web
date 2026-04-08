import type { Order } from '@/types/order';
import type { Product } from '@/types/product';

export const fallbackProducts: Product[] = [
  {
    id: 'demo-headphones',
    name: 'Auraluxe Wireless Headphones',
    description:
      'Premium over-ear headphones with adaptive noise cancellation and 40-hour battery life.',
    price: 129.99,
    stock: 42,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-148470484970-f898a681dcc0?auto=format&fit=crop&w=900&q=80',
    ],
    category: { id: 'audio', name: 'Audio' },
    rating: 4.8,
  },
  {
    id: 'demo-watch',
    name: 'PulseFit Smart Watch',
    description: 'A fitness-first watch with sleep insights, GPS, and fast charging.',
    price: 189,
    stock: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1434494887895-59a10ad0d56a?auto=format&fit=crop&w=900&q=80',
    ],
    category: { id: 'wearables', name: 'Wearables' },
    rating: 4.6,
  },
  {
    id: 'demo-bag',
    name: 'Nomad Commuter Pack',
    description: 'Water-resistant laptop backpack designed for work, travel, and daily carry.',
    price: 89,
    stock: 58,
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1622560847463-a833e1f88c71?auto=format&fit=crop&w=900&q=80',
    ],
    category: { id: 'bags', name: 'Bags' },
    rating: 4.7,
  },
];

export const fallbackOrders: Order[] = [
  { id: 'NX-1001', status: 'PROCESSING', totalAmount: 218, createdAt: new Date().toISOString() },
  {
    id: 'NX-1000',
    status: 'DELIVERED',
    totalAmount: 129,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];
