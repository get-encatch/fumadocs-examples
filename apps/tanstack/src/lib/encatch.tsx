'use client';

import { useEffect } from 'react';
import { _encatch } from '@encatch/web-sdk';
import type { Theme } from '@encatch/web-sdk';

/**
 * Encatch Web SDK integration for Fumadocs docs feedback.
 *
 * Configure via VITE_ENCATCH_* env vars (see .env.example).
 * - EncatchInit: call once in the root layout to init the SDK and sync locale.
 * - open*Form: open footer feedback forms with the current page URL prefilled.
 */

function trimEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

const encatchEnv = {
  publishableKey: trimEnv(import.meta.env.VITE_ENCATCH_SDK_PUBLISHABLE_KEY),
  suggestEditFormSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_SUGGEST_AN_EDIT_FORM_SLUG,
  ),
  suggestAnEditQuestionSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_SUGGEST_AN_EDIT_QUESTION_SLUG,
  ),
  raiseIssueFormSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_RAISE_ISSUE_FORM_SLUG,
  ),
  raiseIssueQuestionSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_RAISE_ISSUE_QUESTION_SLUG,
  ),
  helpfulFormSlug: trimEnv(import.meta.env.VITE_ENCATCH_HELPFUL_FORM_SLUG),
  helpfulPageUrlQuestionSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_HELPFUL_PAGE_URL_QUESTION_SLUG,
  ),
  helpfulChoiceQuestionSlug: trimEnv(
    import.meta.env.VITE_ENCATCH_HELPFUL_CHOICE_QUESTION_SLUG,
  ),
  host: trimEnv(import.meta.env.VITE_ENCATCH_HOST),
};

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

export function openHelpfulFeedbackForm(
  pageUrl: string,
  vote: 'yes' | 'no',
  locale?: string,
) {
  const formSlug = encatchEnv.helpfulFormSlug;
  const pageUrlQuestionSlug = encatchEnv.helpfulPageUrlQuestionSlug;
  const choiceQuestionSlug = encatchEnv.helpfulChoiceQuestionSlug;

  if (!formSlug) {
    console.warn('VITE_ENCATCH_HELPFUL_FORM_SLUG is not set or is empty');
    return;
  }
  if (!pageUrlQuestionSlug) {
    console.warn(
      'VITE_ENCATCH_HELPFUL_PAGE_URL_QUESTION_SLUG is not set or is empty',
    );
    return;
  }
  if (!choiceQuestionSlug) {
    console.warn(
      'VITE_ENCATCH_HELPFUL_CHOICE_QUESTION_SLUG is not set or is empty',
    );
    return;
  }
  if (!ensureEncatchInitialized()) {
    return;
  }
  if (locale) {
    syncEncatchLocale(locale);
  }

  _encatch.addToResponse(pageUrlQuestionSlug, toAbsolutePageUrl(pageUrl));
  _encatch.addToResponse(choiceQuestionSlug, vote);
  _encatch.showForm(formSlug);
}

export function openSuggestEditForm(pageUrl: string, locale?: string) {
  const formSlug = encatchEnv.suggestEditFormSlug;
  const questionSlug = encatchEnv.suggestAnEditQuestionSlug;

  if (!formSlug) {
    console.warn('VITE_ENCATCH_SUGGEST_AN_EDIT_FORM_SLUG is not set or is empty');
    return;
  }
  if (!questionSlug) {
    console.warn('VITE_ENCATCH_SUGGEST_AN_EDIT_QUESTION_SLUG is not set or is empty');
    return;
  }
  if (!ensureEncatchInitialized()) {
    return;
  }
  if (locale) {
    syncEncatchLocale(locale);
  }

  _encatch.addToResponse(questionSlug, toAbsolutePageUrl(pageUrl));
  _encatch.showForm(formSlug);
}

export function openRaiseIssueForm(pageUrl: string, locale?: string) {
  const formSlug = encatchEnv.raiseIssueFormSlug;
  const questionSlug = encatchEnv.raiseIssueQuestionSlug;

  if (!formSlug) {
    console.warn('VITE_ENCATCH_RAISE_ISSUE_FORM_SLUG is not set or is empty');
    return;
  }
  if (!questionSlug) {
    console.warn('VITE_ENCATCH_RAISE_ISSUE_QUESTION_SLUG is not set or is empty');
    return;
  }
  if (!ensureEncatchInitialized()) {
    return;
  }
  if (locale) {
    syncEncatchLocale(locale);
  }

  _encatch.addToResponse(questionSlug, toAbsolutePageUrl(pageUrl));
  _encatch.showForm(formSlug);
}

export function EncatchInit({ locale }: { locale: string }) {
  useEffect(() => {
    ensureEncatchInitialized();
    syncEncatchLocale(locale);
  }, [locale]);

  return null;
}
