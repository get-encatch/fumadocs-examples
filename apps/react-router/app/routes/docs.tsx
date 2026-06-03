import type { Route } from './+types/docs';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import browserCollections from 'collections/browser';
import { baseOptions } from '@/lib/layout.shared';
import { gitConfig } from '@/lib/shared';
import { resolveLocale } from '@/lib/i18n';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { DocsPageFeedback } from '@/components/docs-page-feedback';
import { useMDXComponents } from '@/components/mdx';

export async function loader({ params }: Route.LoaderArgs) {
  const lang = resolveLocale(params.lang);
  const slugs = params['*'].split('/').filter((v) => v.length > 0);
  const page = source.getPage(slugs, lang);
  if (!page) throw new Response('Not found', { status: 404 });

  return {
    path: page.path,
    lang,
    pageUrl: page.url,
    pageTitle: page.data.title,
    markdownUrl: getPageMarkdownUrl(page).url,
    pageTree: await source.serializePageTree(source.getPageTree(lang)),
    imagePath: getPageImage(page).url,
  };
}

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: Mdx },
    {
      markdownUrl,
      path,
      pageUrl,
      pageTitle,
      imagePath,
    }: {
      markdownUrl: string;
      path: string;
      pageUrl: string;
      pageTitle: string;
      imagePath: string;
    },
  ) {
    return (
      <DocsPage toc={toc}>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        <meta property="og:image" content={imagePath} />
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
          />
        </div>
        <DocsBody>
          <Mdx components={useMDXComponents()} />
        </DocsBody>
        <DocsPageFeedback pageUrl={pageUrl} pageTitle={pageTitle} />
      </DocsPage>
    );
  },
});

export default function Page({ loaderData }: Route.ComponentProps) {
  const { path, pageTree, imagePath, markdownUrl, pageUrl, pageTitle, lang } =
    useFumadocsLoader(loaderData);

  return (
    <DocsLayout {...baseOptions(lang)} tree={pageTree}>
      {clientLoader.useContent(path, {
        markdownUrl,
        path,
        pageUrl,
        pageTitle,
        imagePath,
      })}
    </DocsLayout>
  );
}
