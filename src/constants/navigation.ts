import {
  BarChart3,
  Boxes,
  ClipboardList,
  Heart,
  Home,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react';

import type { UserRole } from '@/types/auth';

export const publicNavigation = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
];

export const roleNavigation: Record<
  UserRole,
  Array<{ label: string; href: string; icon: typeof Home }>
> = {
  USER: [
    { label: 'Overview', href: '/dashboard', icon: Home },
    { label: 'Orders', href: '/dashboard/orders', icon: ClipboardList },
    { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
    { label: 'Profile', href: '/dashboard/profile', icon: Settings },
    { label: 'Cart', href: '/cart', icon: ShoppingCart },
  ],

  SELLER: [
    { label: 'Overview', href: '/seller', icon: BarChart3 },
    { label: 'Products', href: '/seller/products', icon: Package },
    { label: 'Inventory', href: '/seller/inventory', icon: Boxes },
    { label: 'Orders', href: '/seller/orders', icon: ClipboardList },
  ],

  ADMIN: [
    { label: 'Overview', href: '/admin', icon: BarChart3 },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Orders', href: '/admin/orders', icon: ClipboardList },
  ],
};
