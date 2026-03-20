import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useLoginMutation, useRegisterMutation } from '@/features/auth/authApi';
import { loginSchema, registerSchema, type RegisterFormValues } from '@/features/auth/authSchemas';

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;

    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message;
    }
  }

  return fallback;
}

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [login, loginState] = useLoginMutation();
  const [registerUser, registerState] = useRegisterMutation();
  const isRegister = mode === 'register';
  const isLoading = loginState.isLoading || registerState.isLoading;
  const resolver = zodResolver(
    isRegister ? registerSchema : loginSchema,
  ) as unknown as Resolver<RegisterFormValues>;
  const form = useForm<RegisterFormValues>({
    resolver,
    defaultValues: { name: '', email: '', password: '', role: 'USER' },
  });

  async function onSubmit(values: RegisterFormValues) {
    setAuthError(null);

    try {
      const response = isRegister
        ? await registerUser(values).unwrap()
        : await login({ email: values.email, password: values.password }).unwrap();
      const role = response.data.user.role;
      toast.success(response.message);
      const fallback = role === 'ADMIN' ? '/admin' : role === 'SELLER' ? '/seller' : '/dashboard';
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from ?? fallback, { replace: true });
    } catch (error) {
      const message = getAuthErrorMessage(
        error,
        isRegister
          ? 'Registration failed. Check your details and try again.'
          : 'Invalid email or password. Please try again.',
      );
      setAuthError(message);
      toast.error(message);
    }
  }

  return (
    <section className="container-page grid min-h-[calc(100vh-8rem)] place-items-center py-12">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
            {isRegister ? 'Create account' : 'Sign in'}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isRegister
              ? 'Join NexCart to shop, track orders, and save your favourites.'
              : 'Sign in to view your orders, cart, and saved items.'}
          </p>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {isRegister ? (
            <Input
              label="Name"
              {...form.register('name')}
              error={form.formState.errors.name?.message}
            />
          ) : null}
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          {isRegister ? (
            <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Role
              <select
                className="focus-ring h-11 w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900"
                {...form.register('role')}
              >
                <option value="USER">User</option>
                <option value="SELLER">Seller</option>
              </select>
            </label>
          ) : null}
          {authError ? (
            <p
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200"
              role="alert"
            >
              {authError}
            </p>
          ) : null}
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {isRegister ? 'Already have an account?' : 'New to NexCart?'}{' '}
          <Link
            className="font-semibold text-indigo-600 dark:text-indigo-300"
            to={isRegister ? '/login' : '/register'}
          >
            {isRegister ? 'Login' : 'Register'}
          </Link>
        </p>
      </Card>
    </section>
  );
}
