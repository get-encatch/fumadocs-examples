import { Link } from 'waku';
import { PageProps } from 'waku/router';
import { unstable_redirect } from 'waku/router/server';
import { resolveLocale, i18n, isDefaultLocaleHiddenInUrl } from '@/lib/i18n';
import { getLocalizedDocsBase } from '@/lib/source';
import { homeEyebrow } from '@/lib/shared';

export default function Home({ lang }: PageProps<'/[lang]'>) {
  const locale = resolveLocale(lang);
  if (isDefaultLocaleHiddenInUrl(locale)) {
    unstable_redirect('/');
  }
  const docsHref = `${getLocalizedDocsBase(locale)}`;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 max-w-xl text-3xl font-medium tracking-tight text-landing-foreground lg:text-4xl">
        {homeEyebrow}
      </h1>
      <p className="mb-8 max-w-md text-fd-muted-foreground">
        Sample docs site with Encatch page feedback in the footer — built on Fumadocs.
      </p>
      <Link
        to={docsHref}
        className="inline-flex justify-center rounded-full bg-brand px-5 py-3 text-sm font-medium tracking-tight text-brand-foreground transition-colors hover:bg-brand-200"
      >
        Open documentation
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
