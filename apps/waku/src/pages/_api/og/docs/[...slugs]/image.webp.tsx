import { appName } from '@/lib/shared';
import { source } from '@/lib/source';
import { ImageResponse } from '@takumi-rs/image-response';
import { generate as DefaultImage } from 'fumadocs-ui/og/takumi';
import { ApiContext } from 'waku/router';
import { docsAssetStaticPaths, parseRouteSlugs } from '@/lib/route-utils';

export async function GET(_: Request, { params }: ApiContext<'/og/docs/[...slugs]/image.webp'>) {
  const parsed = parseRouteSlugs(params.slugs);
  const page = source.getPage(parsed.pageSlugs, parsed.lang);
  if (!page) return new Response(undefined, { status: 404 });

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={appName} />,
    {
      width: 1200,
      height: 630,
      format: 'webp',
    },
  );
}

export async function getConfig() {
  return {
    render: 'static' as const,
    staticPaths: docsAssetStaticPaths(),
  } as const;
}
