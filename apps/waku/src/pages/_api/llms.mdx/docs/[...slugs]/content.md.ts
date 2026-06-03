import { getLLMText, source } from '@/lib/source';
import { ApiContext } from 'waku/router';
import { unstable_notFound } from 'waku/router/server';
import { docsAssetStaticPaths, parseRouteSlugs } from '@/lib/route-utils';

export async function GET(
  _: Request,
  { params }: ApiContext<'/llms.mdx/docs/[...slugs]/content.md'>,
) {
  const parsed = parseRouteSlugs(params.slugs);
  const page = source.getPage(parsed.pageSlugs, parsed.lang);
  if (!page) unstable_notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export async function getConfig() {
  return {
    render: 'static' as const,
    staticPaths: docsAssetStaticPaths(),
  } as const;
}
