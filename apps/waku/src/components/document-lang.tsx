'use client';

import { useEffect } from 'react';
import { useRouter } from 'waku/router/client';
import { localeFromPath } from '@/lib/i18n';

export function DocumentLang() {
  const { path } = useRouter();

  useEffect(() => {
    document.documentElement.lang = localeFromPath(path);
  }, [path]);

  return null;
}
