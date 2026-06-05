import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { createServerFn } from '@tanstack/react-start';
import { slugsToMarkdownPath, source } from '@/lib/source';
import browserCollections from 'collections/browser';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { baseOptions } from '@/lib/layout.shared';
import { gitConfig } from '@/lib/shared';
import { resolveLocale } from '@/lib/i18n';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense } from 'react';
import { DocsPageFeedback } from '@/components/docs-page-feedback';
import { useMDXComponents } from '@/components/mdx';

export const Route = createFileRoute('/{-$lang}/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const lang = resolveLocale(params.lang);
    const slugs = params._splat?.split('/') ?? [];
    const data = await serverLoader({ data: { slugs, lang } });
    await clientLoader.preload(data.path);
    return data;
  },
});

const serverLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { slugs: string[]; lang: string }) => params)
  .handler(async ({ data: { slugs, lang } }) => {
    const page = source.getPage(slugs, lang);
    if (!page) throw notFound();

    return {
      path: page.path,
      lang,
      pageUrl: page.url,
      pageTitle: page.data.title,
      markdownUrl: slugsToMarkdownPath(page.slugs, lang).url,
      pageTree: await source.serializePageTree(source.getPageTree(lang)),
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    {
      markdownUrl,
      path,
      pageUrl,
      pageTitle,
    }: {
      markdownUrl: string;
      path: string;
      pageUrl: string;
      pageTitle: string;
    },
  ) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${gitConfig.contentRoot}/${path}`}
          />
        </div>
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
        <DocsPageFeedback pageUrl={pageUrl} pageTitle={pageTitle} />
      </DocsPage>
    );
  },
});

function Page() {
  const { lang } = Route.useParams();
  const locale = resolveLocale(lang);
  const { path, pageTree, markdownUrl, pageUrl, pageTitle } =
    useFumadocsLoader(Route.useLoaderData());

  return (
    <DocsLayout {...baseOptions(locale)} tree={pageTree}>
      <Suspense>
        {clientLoader.useContent(path, { markdownUrl, path, pageUrl, pageTitle })}
      </Suspense>
    </DocsLayout>
  );
}
