import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18nProvider, uiTranslations } from 'fumadocs-ui/i18n';
import { appName, gitConfig } from './shared';
import { i18n } from './i18n';

function docsFeedbackTranslations() {
  return {
    namespace: 'docsFeedback',
    defaultValue: {
      helpfulQuestion: 'Was this page helpful?',
      yes: 'Yes',
      no: 'No',
      suggestEdits: 'Suggest edits',
      raiseIssue: 'Raise issue',
    },
  };
}

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .extend(docsFeedbackTranslations())
  .add('ui', {
    en: {
      displayName: 'English',
    },
  })
  .add('docsFeedback', {
    en: {
      helpfulQuestion: 'Was this page helpful?',
      yes: 'Yes',
      no: 'No',
      suggestEdits: 'Suggest edits',
      raiseIssue: 'Raise issue',
    },
  });

export function baseOptions(): BaseLayoutProps {
  return {
    i18n: false,
    searchToggle: false,
    nav: {
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

export function getI18nProvider(locale: string) {
  return i18nProvider(translations, locale);
}
