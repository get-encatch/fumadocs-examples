'use client';

import { useCallback, useMemo, type ReactNode } from 'react';
import { EncatchInit } from '@/lib/encatch';
import { RootProvider } from 'fumadocs-ui/provider/waku';
import { useRouter } from 'waku/router/client';
import { getI18nProvider } from '@/lib/layout.shared';
import { localeFromPath, switchLocalePath } from '@/lib/i18n';

export function Provider({ children }: { children: ReactNode }) {
  const { path } = useRouter();
  const locale = localeFromPath(path);

  const onLocaleChange = useCallback(
    (value: string) => {
      const next = switchLocalePath(path, value);
      if (next !== path) {
        window.location.assign(next);
      }
    },
    [path],
  );

  const i18n = useMemo(
    () => ({
      ...getI18nProvider(locale),
      onLocaleChange,
    }),
    [locale, onLocaleChange],
  );

  return (
    <>
      <EncatchInit locale={locale} />
      <RootProvider i18n={i18n}>{children}</RootProvider>
    </>
  );
}
