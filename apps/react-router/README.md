# React Router + Fumadocs + Encatch

## Setup

Copy `.env.example` → `.env` and set `VITE_ENCATCH_*` values (publishable key + combined form slug and question slugs).

**Publishable key:** [admin.encatch.com](https://admin.encatch.com) → **Settings** → **Publishable key**.

## Run

From repo root:

```bash
pnpm dev:react-router
```

From this folder:

```bash
pnpm dev
```

Open http://localhost:3000/docs.

## Encatch — what to refer to

| File | Purpose |
|------|---------|
| `.env.example` | Env var names and default combined form / question slugs |
| `app/lib/encatch.tsx` | SDK init, locale sync, `open*Form` helpers |
| `app/components/docs-page-feedback.tsx` | Footer UI (helpful / suggest edit / raise issue) |
| `app/root.tsx` | `<EncatchInit locale={locale} />` |
| `app/routes/docs.tsx` | `<DocsPageFeedback />` on each docs page |

In-app overview: `content/docs/en/docs-feedback.mdx`.
