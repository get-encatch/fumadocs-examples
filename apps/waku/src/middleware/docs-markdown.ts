import type { MiddlewareHandler } from 'hono';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { getLocalizedDocsBase } from '@/lib/source';
import { i18n, stripDefaultLocalePath } from '@/lib/i18n';

const docsMarkdown = (): MiddlewareHandler => {
  return async (c, next) => {
    const url = new URL(c.req.url);
    const pathname = url.pathname;

    const canonicalPath = stripDefaultLocalePath(pathname);
    if (canonicalPath) {
      const target = new URL(canonicalPath + url.search, url);
      return c.redirect(target.toString(), 307);
    }

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
        return c.redirect(new URL(suffixPath, url).toString());
      }

      if (isMarkdownPreferred(c.req.raw)) {
        const { rewrite: rewriteDocs } = rewritePath(
          `${base}{/*path}`,
          `${docsContentRoute}{/*path}/content.md`,
        );
        const docsPath = rewriteDocs(pathname);
        if (docsPath) {
          return c.redirect(new URL(docsPath, url).toString());
        }
      }
    }

    if (pathname.startsWith(docsRoute)) {
      const { rewrite: rewriteSuffix } = rewritePath(
        `${docsRoute}{/*path}.md`,
        `${docsContentRoute}{/*path}/content.md`,
      );
      const suffixPath = rewriteSuffix(pathname);
      if (suffixPath) {
        return c.redirect(new URL(suffixPath, url).toString());
      }
    }

    return next();
  };
};

export default docsMarkdown;
