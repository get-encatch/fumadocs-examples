import Link from 'next/link';

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const docsHref = lang === 'en' ? '/docs' : `/${lang}/docs`;

  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">Hello World</h1>
      <p>
        You can open{' '}
        <Link href={docsHref} className="font-medium underline">
          {docsHref}
        </Link>{' '}
        and see the documentation.
      </p>
    </div>
  );
}
