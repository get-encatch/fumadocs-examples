'use client';

import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { CircleAlert, Pencil, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useTranslations } from 'fumadocs-ui/contexts/i18n';
import {
  openHelpfulFeedbackForm,
  openRaiseIssueForm,
  openSuggestEditForm,
} from '@/lib/encatch';
import { resolveLocale } from '@/lib/i18n';

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const pillClass = (active = false) =>
  cn(
    'inline-flex items-center gap-1.5 rounded-full border border-fd-border/80 bg-fd-background px-3 py-1.5 text-sm font-normal text-fd-foreground shadow-none transition-colors',
    'hover:bg-fd-accent/50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring/40 focus-visible:ring-offset-1',
    active && 'border-fd-border bg-fd-accent/60',
  );

export interface DocsPageFeedbackProps {
  pageUrl: string;
  pageTitle: string;
}

export function DocsPageFeedback({
  pageUrl,
  pageTitle,
}: DocsPageFeedbackProps) {
  const t = useTranslations('docsFeedback');
  const { lang } = useParams({ strict: false });
  const locale = resolveLocale(lang);
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);

  const handleVote = (next: 'yes' | 'no') => {
    const newVote = vote === next ? null : next;
    setVote(newVote);
    if (newVote) {
      openHelpfulFeedbackForm(pageUrl, newVote, locale);
    }
  };

  return (
    <div className="mt-8 border-t border-fd-border/60 pt-6 not-prose">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-fd-foreground">{t?.helpfulQuestion}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleVote('yes')}
              aria-pressed={vote === 'yes'}
              className={pillClass(vote === 'yes')}
            >
              <ThumbsUp className="size-4 shrink-0" strokeWidth={1.5} />
              <span>{t?.yes}</span>
            </button>
            <button
              type="button"
              onClick={() => handleVote('no')}
              aria-pressed={vote === 'no'}
              className={pillClass(vote === 'no')}
            >
              <ThumbsDown className="size-4 shrink-0" strokeWidth={1.5} />
              <span>{t?.no}</span>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openSuggestEditForm(pageUrl, locale)}
            className={pillClass()}
          >
            <Pencil className="size-4 shrink-0" strokeWidth={1.5} />
            <span>{t?.suggestEdits}</span>
          </button>
          <button
            type="button"
            onClick={() => openRaiseIssueForm(pageUrl, locale)}
            className={pillClass()}
          >
            <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} />
            <span>{t?.raiseIssue}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
