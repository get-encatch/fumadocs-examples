import type { Viewport } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Geist } from 'next/font/google';
import '../global.css';
import { EncatchInit } from '@/lib/encatch';
import { getI18nProvider } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';

const geist = Geist({
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return (
    <html lang={lang} className={geist.className} suppressHydrationWarning>
      <body
        className="framework relative flex min-h-screen flex-col"
        suppressHydrationWarning
      >
        <EncatchInit locale={lang} />
        <RootProvider i18n={getI18nProvider(lang)} search={{ enabled: false }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
