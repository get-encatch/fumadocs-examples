import { RootProvider } from 'fumadocs-ui/provider/next';
import '../global.css';
import { EncatchInit } from '@/lib/encatch';
import { getI18nProvider } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <EncatchInit locale={lang} />
        <RootProvider i18n={getI18nProvider(lang)}>{children}</RootProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
