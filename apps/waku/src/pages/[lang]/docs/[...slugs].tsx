import { PageProps } from 'waku/router';
import { unstable_redirect } from 'waku/router/server';
import { DocsPageContent } from '@/components/docs-page-content';
import { isDefaultLocaleHiddenInUrl, resolveLocale } from '@/lib/i18n';
import { localizedStaticPaths } from '@/lib/route-utils';

export default function Page({
  lang,
  slugs,
}: PageProps<'/[lang]/docs/[...slugs]'>) {
  const locale = resolveLocale(lang);
  if (isDefaultLocaleHiddenInUrl(locale)) {
    unstable_redirect(
      slugs.length > 0 ? `/docs/${slugs.join('/')}` : '/docs',
    );
  }
  return <DocsPageContent lang={locale} slugs={slugs} />;
}

export async function getConfig() {
  return {
    render: 'static' as const,
    staticPaths: localizedStaticPaths(),
  } as const;
}
