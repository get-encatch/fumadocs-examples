import Link from 'next/link';
import { homeEyebrow } from '@/lib/shared';

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const docsHref = lang === 'en' ? '/docs' : `/${lang}/docs`;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 max-w-xl text-3xl font-medium tracking-tight text-landing-foreground lg:text-4xl">
        {homeEyebrow}
      </h1>
      <p className="mb-8 max-w-md text-fd-muted-foreground">
        Sample docs site with Encatch page feedback in the footer — built on Fumadocs.
      </p>
      <Link
        href={docsHref}
        className="inline-flex justify-center rounded-full bg-brand px-5 py-3 text-sm font-medium tracking-tight text-brand-foreground transition-colors hover:bg-brand-200"
      >
        Open documentation
      </Link>
    </div>
  );
}
