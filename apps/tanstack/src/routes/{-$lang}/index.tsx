import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { resolveLocale } from '@/lib/i18n';

export const Route = createFileRoute('/{-$lang}/')({
  component: Home,
});

function Home() {
  const { lang } = Route.useParams();
  const locale = resolveLocale(lang);

  return (
    <HomeLayout {...baseOptions(locale)}>
      <div className="flex flex-col flex-1 justify-center px-4 py-8 text-center">
        <h1 className="font-medium text-xl mb-4">Fumadocs on Tanstack Start.</h1>
        <Link
          to="/{-$lang}/docs/$"
          params={{
            lang,
            _splat: '',
          }}
          className="px-3 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm mx-auto"
        >
          Open Docs
        </Link>
      </div>
    </HomeLayout>
  );
}
