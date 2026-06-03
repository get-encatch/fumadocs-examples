import { Link } from 'waku';
import { PageProps } from 'waku/router';
import { unstable_redirect } from 'waku/router/server';
import { resolveLocale, i18n, isDefaultLocaleHiddenInUrl } from '@/lib/i18n';
import { getLocalizedDocsBase } from '@/lib/source';

export default function Home({ lang }: PageProps<'/[lang]'>) {
  const locale = resolveLocale(lang);
  if (isDefaultLocaleHiddenInUrl(locale)) {
    unstable_redirect('/');
  }
  const docsHref = `${getLocalizedDocsBase(locale)}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h1 className="font-medium text-xl mb-4">Fumadocs on Waku.</h1>
      <Link
        to={docsHref}
        className="px-3 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm mx-auto"
      >
        Open Docs
      </Link>
    </div>
  );
}

export async function getConfig() {
  return {
    render: 'static' as const,
    staticPaths: i18n.languages.filter((lang) => lang !== i18n.defaultLanguage),
  } as const;
}
