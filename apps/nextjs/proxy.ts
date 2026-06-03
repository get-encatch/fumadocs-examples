import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { createI18nMiddleware, DefaultFormatter } from 'fumadocs-core/i18n/middleware';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { i18n } from '@/lib/i18n';

const handleI18n = createI18nMiddleware({
  ...i18n,
  format: {
    ...DefaultFormatter,
    add(url, locale) {
      if (url.pathname === '/') {
        const next = new URL(url);
        next.pathname = `/${locale}`;
        return next;
      }

      return DefaultFormatter.add(url, locale);
    },
  },
});

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteLocalizedDocs } = rewritePath(
  `/{locale}${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteLocalizedSuffix } = rewritePath(
  `/{locale}${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

function handleMarkdown(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  for (const rewrite of [
    rewriteSuffix,
    rewriteLocalizedSuffix,
    ...(isMarkdownPreferred(request) ? [rewriteDocs, rewriteLocalizedDocs] : []),
  ]) {
    const result = rewrite(pathname);
    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }
}

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const markdownResponse = handleMarkdown(request);
  if (markdownResponse) return markdownResponse;

  return handleI18n(request, event);
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|og|llms).*)',
  ],
};
