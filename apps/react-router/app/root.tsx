import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
} from 'react-router';
import { EncatchInit } from '@/lib/encatch';
import { RootProvider } from 'fumadocs-ui/provider/react-router';
import type { Route } from './+types/root';
import './app.css';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import NotFound from './routes/not-found';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { getI18nProvider } from '@/lib/layout.shared';
import { i18n, resolveLocale } from '@/lib/i18n';
import { getLocalizedDocsBase } from '@/lib/source';

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang } = useParams();
  const locale = resolveLocale(lang);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className="framework relative flex min-h-screen flex-col"
        suppressHydrationWarning
      >
        <EncatchInit locale={locale} />
        <RootProvider i18n={getI18nProvider(locale)} search={{ enabled: false }}>
          {children}
        </RootProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFound />;
    message = 'Error';
    details = error.statusText;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 w-full max-w-[1400px] mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

const serverMiddleware: Route.MiddlewareFunction = async ({ request }, next) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.endsWith('.md')) {
    return next();
  }

  for (const language of i18n.languages) {
    const base = getLocalizedDocsBase(language);

    const { rewrite: rewriteSuffix } = rewritePath(
      `${base}{/*path}.md`,
      `${docsContentRoute}{/*path}/content.md`,
    );
    const suffixPath = rewriteSuffix(pathname);
    if (suffixPath) {
      return Response.redirect(new URL(suffixPath, url));
    }

    if (isMarkdownPreferred(request)) {
      const { rewrite: rewriteDocs } = rewritePath(
        `${base}{/*path}`,
        `${docsContentRoute}{/*path}/content.md`,
      );
      const docsPath = rewriteDocs(pathname);
      if (docsPath) {
        return Response.redirect(new URL(docsPath, url));
      }
    }
  }

  // Fallback for default docs route without locale prefix in patterns
  if (pathname.startsWith(docsRoute)) {
    const { rewrite: rewriteSuffix } = rewritePath(
      `${docsRoute}{/*path}.md`,
      `${docsContentRoute}{/*path}/content.md`,
    );
    const suffixPath = rewriteSuffix(pathname);
    if (suffixPath) {
      return Response.redirect(new URL(suffixPath, url));
    }
  }

  return next();
};

export const middleware = [serverMiddleware];
