# Waku + Fumadocs + Encatch

## Setup

Copy `.env.example` → `.env` and set `VITE_ENCATCH_*` values (publishable key + form slugs).

**Publishable key:** [admin.encatch.com](https://admin.encatch.com) → **Settings** → **Publishable key**.

## Run

From repo root:

```bash
pnpm dev:waku
```

From this folder:

```bash
pnpm dev
```

Open http://localhost:3000/docs.

## Encatch — what to refer to

| File | Purpose |
|------|---------|
| `.env.example` | Env var names and default form slugs |
| `src/lib/encatch.tsx` | SDK init, locale sync, `open*Form` helpers |
| `src/components/docs-page-feedback.tsx` | Footer UI (helpful / suggest edit / raise issue) |
| `src/components/provider.tsx` | `<EncatchInit locale={locale} />` |
| `src/components/docs-page-content.tsx` | `<DocsPageFeedback />` on each docs page |

In-app overview: `content/docs/en/docs-feedback.mdx`.
