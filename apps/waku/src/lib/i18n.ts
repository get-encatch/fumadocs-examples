import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'es'],
  parser: 'dir',
  hideLocale: 'default-locale',
});

export function resolveLocale(lang?: string) {
  return lang ?? i18n.defaultLanguage;
}

/**
 * When `hideLocale` is `default-locale`, English URLs must not use the `/en` prefix
 * (canonical paths are `/docs`, not `/en/docs`). Returns the stripped path or null.
 */
export function stripDefaultLocalePath(pathname: string): string | null {
  if (i18n.hideLocale !== 'default-locale') {
    return null;
  }
  const prefix = `/${i18n.defaultLanguage}`;
  if (pathname === prefix) {
    return '/';
  }
  if (pathname.startsWith(`${prefix}/`)) {
    const stripped = pathname.slice(prefix.length);
    return stripped.length > 0 ? stripped : '/';
  }
  return null;
}

export function isDefaultLocaleHiddenInUrl(lang: string) {
  return (
    i18n.hideLocale === 'default-locale' && lang === i18n.defaultLanguage
  );
}

export function localeFromPath(path: string) {
  for (const language of i18n.languages) {
    if (language === i18n.defaultLanguage && i18n.hideLocale === 'default-locale') {
      continue;
    }

    if (path === `/${language}` || path.startsWith(`/${language}/`)) {
      return language;
    }
  }

  return i18n.defaultLanguage;
}

export function isNonDefaultLocale(lang: string) {
  return i18n.hideLocale === 'default-locale' && lang !== i18n.defaultLanguage;
}

export function toDocsRoutePath(slug: string[], lang: string) {
  if (i18n.hideLocale === 'default-locale' && lang === i18n.defaultLanguage) {
    return slug;
  }

  if (i18n.hideLocale === 'always') {
    return slug;
  }

  return [lang, ...slug];
}

export function switchLocalePath(pathname: string, locale: string) {
  let segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first && i18n.languages.includes(first as (typeof i18n.languages)[number])) {
    segments = segments.slice(1);
  }

  const needsPrefix =
    i18n.hideLocale === 'never' ||
    (i18n.hideLocale === 'default-locale' && locale !== i18n.defaultLanguage);

  if (needsPrefix) {
    segments.unshift(locale);
  }

  return segments.length > 0 ? `/${segments.join('/')}` : '/';
}
