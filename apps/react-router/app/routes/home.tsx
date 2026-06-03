import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link, useParams } from 'react-router';
import { baseOptions } from '@/lib/layout.shared';
import { i18n, resolveLocale } from '@/lib/i18n';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const { lang } = useParams();
  const locale = resolveLocale(lang);
  const docsTo =
    locale === i18n.defaultLanguage ? '/docs' : `/${locale}/docs`;

  return (
    <HomeLayout {...baseOptions(locale)}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Fumadocs on React Router.</h1>
        <p className="text-fd-muted-foreground mb-4">
          The truly flexible docs framework on React.js.
        </p>
        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to={docsTo}
        >
          Open Docs
        </Link>
      </div>
    </HomeLayout>
  );
}
