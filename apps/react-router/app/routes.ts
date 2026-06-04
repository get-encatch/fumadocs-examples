import { route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route(':lang?', 'routes/home.tsx'),
  route(':lang?/docs/*', 'routes/docs.tsx'),
  route('og/docs/*', 'routes/og.docs.tsx'),

  // LLM integration:
  route('llms.txt', 'llms/index.ts'),
  route('llms-full.txt', 'llms/full.ts'),
  route('llms.mdx/docs/*', 'llms/mdx.ts'),

  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
