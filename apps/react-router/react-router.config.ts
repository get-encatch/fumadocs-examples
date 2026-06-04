import type { Config } from '@react-router/dev/config';
import { glob } from 'node:fs/promises';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';
import { docsImageRoute, docsRoute } from './app/lib/shared';
import { i18n } from './app/lib/i18n';

const getDocsUrl = createGetUrl(docsRoute);

function getLocalizedPageUrl(lang: string, slugs: string[]) {
  const url = getDocsUrl(slugs);
  if (i18n.hideLocale === 'default-locale' && lang === i18n.defaultLanguage) {
    return url;
  }
  return `/${lang}${url}`;
}

export default {
  ssr: true,
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
  async prerender({ getStaticPaths }) {
    const paths: string[] = [...getStaticPaths()];

    for await (const entry of glob('**/*.mdx', { cwd: 'content/docs' })) {
      const [lang, ...rest] = entry.split('/');
      if (!(i18n.languages as readonly string[]).includes(lang)) continue;

      const slugs = getSlugs(rest.join('/'));
      paths.push(getLocalizedPageUrl(lang, slugs));
      paths.push(`${docsImageRoute}/${[...slugs, 'image.webp'].join('/')}`);
    }

    return paths;
  },
} satisfies Config;
