import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/hooks/reduxHooks';

import type { UserRole } from '@/types/auth';

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: UserRole[] }) {
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!accessToken || !user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
