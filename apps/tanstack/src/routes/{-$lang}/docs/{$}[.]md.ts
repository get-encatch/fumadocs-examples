import { createFileRoute, notFound } from '@tanstack/react-router';
import { getLLMText, markdownPathToSlugs, source } from '@/lib/source';
import { resolveLocale } from '@/lib/i18n';

export const Route = createFileRoute('/{-$lang}/docs/{$}.md')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const lang = resolveLocale(params.lang);
        const slugs = markdownPathToSlugs(params._splat?.split('/') ?? []);
        const page = source.getPage(slugs, lang);
        if (!page) throw notFound();

        return new Response(await getLLMText(page), {
          headers: {
            'Content-Type': 'text/markdown',
          },
        });
      },
    },
  },
});
