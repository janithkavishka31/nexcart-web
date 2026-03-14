import { useEffect, type PropsWithChildren } from 'react';

import { Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import { store } from '@/app/store';

import { useAppSelector } from '@/hooks/reduxHooks';

function ThemeBridge({ children }: PropsWithChildren) {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark' || (theme === 'system' && prefersDark),
    );
  }, [theme]);

  return <>{children}</>;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeBridge>
        <BrowserRouter>{children}</BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </ThemeBridge>
    </Provider>
  );
}
