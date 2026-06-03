# Fumadocs multi-framework examples

Sample Fumadocs docs sites (Next.js, TanStack Start, React Router, Waku) with Encatch page feedback in the footer.

## Setup

```bash
pnpm install
```

In the app you want to run, copy `.env.example` → `.env` and set your Encatch publishable key and form slugs (see that app’s README for variable names).

**Publishable key:** [admin.encatch.com](https://admin.encatch.com) → **Settings** → **Publishable key**.

## Run an app

| App | Command | Docs |
|-----|---------|------|
| Next.js | `pnpm dev:nextjs` | http://localhost:3000/docs |
| TanStack Start | `pnpm dev:tanstack` | http://localhost:3000/docs |
| React Router | `pnpm dev:react-router` | http://localhost:3000/docs |
| Waku | `pnpm dev:waku` | http://localhost:3000/docs |

From an app folder: `pnpm dev`.

## Encatch integration (all apps)

Each app uses the same pattern:

1. **`.env`** — publishable key + form slugs (from `.env.example`).
2. **`lib/encatch.tsx`** — SDK init, env, and form helpers.
3. **`components/docs-page-feedback.tsx`** — footer UI.
4. Root layout — `<EncatchInit locale={...} />`.
5. Docs page — `<DocsPageFeedback pageUrl={...} pageTitle={...} />`.

Details per framework: [`apps/nextjs`](./apps/nextjs), [`apps/tanstack`](./apps/tanstack), [`apps/react-router`](./apps/react-router), [`apps/waku`](./apps/waku).
