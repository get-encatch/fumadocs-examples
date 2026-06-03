import { i18n, isNonDefaultLocale, toDocsRoutePath } from './i18n';
import { source } from './source';

export function defaultLocaleStaticPaths() {
  return source
    .generateParams('slug', 'lang')
    .filter(({ lang }) => lang === i18n.defaultLanguage)
    .map(({ slug }) => slug);
}

export function localizedStaticPaths() {
  return source
    .generateParams('slug', 'lang')
    .filter(({ lang }) => isNonDefaultLocale(lang))
    .map(({ slug, lang }) => [lang, ...slug]);
}

export function docsAssetStaticPaths() {
  return source
    .generateParams('slug', 'lang')
    .map(({ slug, lang }) => toDocsRoutePath(slug, lang));
}

export function parseRouteSlugs(slugs: string[]) {
  const first = slugs[0];
  if (
    first &&
    i18n.languages.includes(first as (typeof i18n.languages)[number]) &&
    (i18n.hideLocale !== 'default-locale' || first !== i18n.defaultLanguage)
  ) {
    return {
      lang: first,
      pageSlugs: slugs.slice(1),
    };
  }

  return {
    lang: i18n.defaultLanguage,
    pageSlugs: slugs,
  };
}
