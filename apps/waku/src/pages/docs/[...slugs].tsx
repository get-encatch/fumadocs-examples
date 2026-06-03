import { PageProps } from 'waku/router';
import { DocsPageContent } from '@/components/docs-page-content';
import { i18n } from '@/lib/i18n';
import { defaultLocaleStaticPaths } from '@/lib/route-utils';

export default function Page({ slugs }: PageProps<'/docs/[...slugs]'>) {
  return <DocsPageContent lang={i18n.defaultLanguage} slugs={slugs} />;
}

export async function getConfig() {
  return {
    render: 'static' as const,
    staticPaths: defaultLocaleStaticPaths(),
  } as const;
}
