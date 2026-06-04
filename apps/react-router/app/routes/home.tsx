import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link, useParams } from 'react-router';
import { baseOptions } from '@/lib/layout.shared';
import { homeEyebrow } from '@/lib/shared';
import { i18n, resolveLocale } from '@/lib/i18n';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Encatch × Fumadocs — React Router example' },
    {
      name: 'description',
      content: 'Encatch page feedback on Fumadocs — sample documentation site.',
    },
  ];
}

export default function Home() {
  const { lang } = useParams();
  const locale = resolveLocale(lang);
  const docsTo =
    locale === i18n.defaultLanguage ? '/docs' : `/${locale}/docs`;

  return (
    <HomeLayout {...baseOptions(locale)}>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-4 max-w-xl text-3xl font-medium tracking-tight text-landing-foreground lg:text-4xl">
          {homeEyebrow}
        </h1>
        <p className="mb-8 max-w-md text-fd-muted-foreground">
          Sample docs site with Encatch page feedback in the footer — built on Fumadocs.
        </p>
        <Link
          className="inline-flex justify-center rounded-full bg-brand px-5 py-3 text-sm font-medium tracking-tight text-brand-foreground transition-colors hover:bg-brand-200"
          to={docsTo}
        >
          Open documentation
        </Link>
      </div>
    </HomeLayout>
  );
}
