import { createMiddleware, createStart } from '@tanstack/react-start';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import { redirect } from '@tanstack/react-router';
import { docsRoute } from '@/lib/shared';
import { getLocalizedDocsBase, slugsToMarkdownPath } from './lib/source';
import { i18n, resolveLocale } from './lib/i18n';

const llmMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!isMarkdownPreferred(request) || pathname.endsWith('.md')) {
    return next();
  }

  for (const language of i18n.languages) {
    const base = getLocalizedDocsBase(language);
    if (!pathname.startsWith(`${base}/`) && pathname !== base) continue;

    const slugs = pathname
      .slice(base.length)
      .split('/')
      .filter((v) => v.length > 0);

    url.pathname = slugsToMarkdownPath(slugs, resolveLocale(language)).url;
    throw redirect(url);
  }

  return next();
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [llmMiddleware],
  };
});
