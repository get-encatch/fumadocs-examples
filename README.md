# Fumadocs multi-framework examples

Sample Fumadocs docs sites (Next.js, TanStack Start, React Router, Waku) with Encatch page feedback in the footer.

<table>
<tr>
<td valign="top">
<p><strong>Don't have the feedback form yet?</strong></p>
<p>Click the button to install a ready-made documentation feedback form in your Encatch workspace. It creates the combined form used in this example — helpful votes, suggest edits, and issue reports — with no manual form builder setup.</p>
</td>
<td align="center" valign="middle" width="210">
<a href="https://templates.encatch.com/templates/preview/documentation-frameworks/docs-feedback"><img src="https://encatch.com/button" alt="Encatch it" width="210" height="42"></a>
</td>
</tr>
</table>

## Setup

```bash
pnpm install
```

**Option A — Install the form:** use the button above if you need the feedback form created in Encatch.

**Option B — Wire this site:** In the app you want to run, copy `.env.example` → `.env` and set your Encatch publishable key and combined form slug / question slugs (see that app’s README for variable names).

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

1. **`.env`** — publishable key + combined form slug and question slugs (from `.env.example`).
2. **`lib/encatch.tsx`** — SDK init, env, and form helpers.
3. **`components/docs-page-feedback.tsx`** — footer UI.
4. Root layout — `<EncatchInit locale={...} />`.
5. Docs page — `<DocsPageFeedback pageUrl={...} pageTitle={...} />`.

Details per framework: [`apps/nextjs`](./apps/nextjs), [`apps/tanstack`](./apps/tanstack), [`apps/react-router`](./apps/react-router), [`apps/waku`](./apps/waku).
