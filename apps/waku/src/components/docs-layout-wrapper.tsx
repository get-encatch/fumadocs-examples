import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { resolveLocale } from '@/lib/i18n';
import { source } from '@/lib/source';

export function DocsLayoutWrapper({
  children,
  locale,
}: {
  children: ReactNode;
  locale?: string;
}) {
  const lang = resolveLocale(locale);

  return (
    <DocsLayout {...baseOptions(lang)} tree={source.getPageTree(lang)}>
      {children}
    </DocsLayout>
  );
}
