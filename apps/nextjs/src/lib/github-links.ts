import { siteConfig } from './site-config';

const { github } = siteConfig;

function normalizeContentPath(contentPath: string) {
  return contentPath.startsWith('/') ? contentPath.slice(1) : contentPath;
}

export function getSuggestEditsUrl(contentPath: string) {
  const path = normalizeContentPath(contentPath);
  return `https://github.com/${github.owner}/${github.repo}/edit/${github.branch}/${github.contentRoot}/${path}`;
}

export function getRaiseIssueUrl(pageTitle: string, pageUrl: string) {
  const params = new URLSearchParams({
    title: `Docs feedback: ${pageTitle}`,
    body: `Page: ${pageUrl}\n\nDescribe the issue or suggestion:`,
  });

  return `https://github.com/${github.owner}/${github.repo}/issues/new?${params.toString()}`;
}
