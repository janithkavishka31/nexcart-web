import { lazy, Suspense } from 'react';

import { Route, Routes } from 'react-router-dom';

import { Loader } from '@/components/common/Loader';

import { DashboardLayout } from '@/layouts/DashboardLayout';

import { RootLayout } from '@/layouts/RootLayout';

import { ProtectedRoute } from './ProtectedRoute';

const HomePage = lazy(() => import('@/pages/public/HomePage'));
const ProductsPage = lazy(() => import('@/pages/public/ProductsPage'));
const ProductDetailsPage = lazy(() => import('@/pages/public/ProductDetailsPage'));
const CategoriesPage = lazy(() => import('@/pages/public/CategoriesPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const CartPage = lazy(() => import('@/pages/user/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/user/CheckoutPage'));
const UserDashboardPage = lazy(() => import('@/pages/user/UserDashboardPage'));
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'));
const OrdersPage = lazy(() => import('@/pages/user/OrdersPage'));
const WishlistPage = lazy(() => import('@/pages/user/WishlistPage'));
const SellerDashboardPage = lazy(() => import('@/pages/seller/SellerDashboardPage'));
const SellerProductsPage = lazy(() => import('@/pages/seller/SellerProductsPage'));
const SellerInventoryPage = lazy(() => import('@/pages/seller/SellerInventoryPage'));
const SellerOrdersPage = lazy(() => import('@/pages/seller/SellerOrdersPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const UnauthorizedPage = lazy(() => import('@/pages/system/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('@/pages/system/NotFoundPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<Loader label="Loading page" />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:productId" element={<ProductDetailsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route element={<ProtectedRoute allowedRoles={['USER', 'SELLER', 'ADMIN']} />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<UserDashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']} />}>
            <Route path="seller" element={<DashboardLayout />}>
              <Route index element={<SellerDashboardPage />} />
              <Route path="products" element={<SellerProductsPage />} />
              <Route path="inventory" element={<SellerInventoryPage />} />
              <Route path="orders" element={<SellerOrdersPage />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
