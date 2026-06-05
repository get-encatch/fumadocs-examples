import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { unstable_notFound } from 'waku/router/server';
import { gitConfig } from '@/lib/shared';
import { DocsPageFeedback } from '@/components/docs-page-feedback';
import { DocsLayoutWrapper } from '@/components/docs-layout-wrapper';
import { getMDXComponents } from '@/components/mdx';

export function DocsPageContent({
  lang,
  slugs,
}: {
  lang: string;
  slugs: string[];
}) {
  const page = source.getPage(slugs, lang);
  if (!page) unstable_notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsLayoutWrapper locale={lang}>
      <DocsPage toc={page.data.toc}>
        <meta property="og:image" content={getPageImage(page).url} />
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${gitConfig.contentRoot}/${page.path}`}
          />
        </div>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
        <DocsPageFeedback
          pageUrl={page.url}
          pageTitle={page.data.title}
          locale={lang}
        />
      </DocsPage>
    </DocsLayoutWrapper>
  );
}
