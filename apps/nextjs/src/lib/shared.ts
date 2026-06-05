export const appName = 'Encatch example';
export const frameworkExample = 'Next.js example';
export const homeEyebrow = `Encatch × Fumadocs — ${frameworkExample}`;

/** Used for Open Graph / Twitter image URLs. Set `NEXT_PUBLIC_SITE_URL` in production. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'get-encatch',
  repo: 'fumadocs-examples',
  branch: 'main',
  contentRoot: 'apps/nextjs/content/docs',
};
