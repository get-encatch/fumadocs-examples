import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useParams,
} from '@tanstack/react-router';
import * as React from 'react';
import appCss from '@/styles/app.css?url';
import { EncatchInit } from '@/lib/encatch';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { getI18nProvider } from '@/lib/layout.shared';
import { resolveLocale } from '@/lib/i18n';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Encatch × Fumadocs — TanStack example',
      },
      {
        name: 'theme-color',
        content: '#fff',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { lang } = useParams({ strict: false });
  const locale = resolveLocale(lang);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="framework relative flex min-h-screen flex-col">
        <EncatchInit locale={locale} />
        <RootProvider i18n={getI18nProvider(locale)} search={{ enabled: false }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
