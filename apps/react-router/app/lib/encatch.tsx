'use client';

import { useEffect } from 'react';
import { _encatch } from '@encatch/web-sdk';
import type { Theme } from '@encatch/web-sdk';

/**
 * Encatch Web SDK integration for Fumadocs docs feedback.
 *
 * Configure via VITE_ENCATCH_* env vars (see .env.example).
 * - EncatchInit: call once in the root layout to init the SDK and sync locale.
 * - open*Form: open the combined documentation feedback form with routing
 *   prefilled via logic jumps (page helpful, suggest edit, raise issue).
 */

function trimEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

const encatchEnv = {
  publishableKey: trimEnv(import.meta.env.VITE_ENCATCH_SDK_PUBLISHABLE_KEY),
  formSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_DOCUMENTATION_FEEDBACK_FORM_SLUG,
  ),
  feedbackTypeQuestionSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_FEEDBACK_TYPE_QUESTION_SLUG,
  ),
  pageUrlQuestionSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_PAGE_URL_QUESTION_SLUG,
  ),
  helpfulChoiceQuestionSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_HELPFUL_CHOICE_QUESTION_SLUG,
  ),
  host: trimEnv(import.meta.env.VITE_ENCATCH_HOST),
};

type DocumentationFeedbackRoute = 'page-helpful' | 'suggest-edit' | 'raise-issue';

/** Ensure `_encatch.init` has run before `showForm` / other SDK calls. */
export function ensureEncatchInitialized(options?: { theme?: Theme }): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const apiKey = encatchEnv.publishableKey;
  if (!apiKey) {
    console.warn('VITE_ENCATCH_SDK_PUBLISHABLE_KEY is not set or is empty');
    return false;
  }
  if (!_encatch._initialized) {
    try {
      const theme: Theme = options?.theme ?? 'system';
      _encatch.init(apiKey, { theme });
    } catch (error) {
      console.error('Encatch init failed:', error);
      return false;
    }
  }
  return true;
}

/** Sync Encatch form language with the active Fumadocs locale. */
export function syncEncatchLocale(locale: string): void {
  if (!ensureEncatchInitialized()) {
    return;
  }
  const normalized = locale.trim();
  if (!normalized) {
    return;
  }
  _encatch.setLocale(normalized);
}

function toAbsolutePageUrl(pageUrl: string): string {
  return typeof window !== 'undefined'
    ? new URL(pageUrl, window.location.origin).href
    : pageUrl;
}

function openDocumentationFeedbackForm(
  pageUrl: string,
  route: DocumentationFeedbackRoute,
  locale?: string,
  helpfulVote?: 'yes' | 'no',
) {
  const {
    formSlug,
    feedbackTypeQuestionSlug,
    pageUrlQuestionSlug,
    helpfulChoiceQuestionSlug,
  } = encatchEnv;

  if (!formSlug) {
    console.warn(
      'VITE_ENCATCH_DOCUMENTATION_FEEDBACK_FORM_SLUG is not set or is empty',
    );
    return;
  }
  if (!feedbackTypeQuestionSlug) {
    console.warn(
      'VITE_ENCATCH_FEEDBACK_TYPE_QUESTION_SLUG is not set or is empty',
    );
    return;
  }
  if (!pageUrlQuestionSlug) {
    console.warn(
      'VITE_ENCATCH_PAGE_URL_QUESTION_SLUG is not set or is empty',
    );
    return;
  }
  if (route === 'page-helpful') {
    if (!helpfulChoiceQuestionSlug) {
      console.warn(
        'VITE_ENCATCH_HELPFUL_CHOICE_QUESTION_SLUG is not set or is empty',
      );
      return;
    }
    if (!helpfulVote) {
      console.warn('Helpful feedback requires a yes/no vote');
      return;
    }
  }
  if (!ensureEncatchInitialized()) {
    return;
  }
  if (locale) {
    syncEncatchLocale(locale);
  }

  _encatch.addToResponse(feedbackTypeQuestionSlug, route);
  _encatch.addToResponse(pageUrlQuestionSlug, toAbsolutePageUrl(pageUrl));
  if (route === 'page-helpful' && helpfulVote) {
    _encatch.addToResponse(helpfulChoiceQuestionSlug, helpfulVote);
  }
  _encatch.showForm(formSlug);
}

export function openHelpfulFeedbackForm(
  pageUrl: string,
  vote: 'yes' | 'no',
  locale?: string,
) {
  openDocumentationFeedbackForm(pageUrl, 'page-helpful', locale, vote);
}

export function openSuggestEditForm(pageUrl: string, locale?: string) {
  openDocumentationFeedbackForm(pageUrl, 'suggest-edit', locale);
}

export function openRaiseIssueForm(pageUrl: string, locale?: string) {
  openDocumentationFeedbackForm(pageUrl, 'raise-issue', locale);
}

export function EncatchInit({ locale }: { locale: string }) {
  useEffect(() => {
    ensureEncatchInitialized();
    syncEncatchLocale(locale);
  }, [locale]);

  return null;
}
