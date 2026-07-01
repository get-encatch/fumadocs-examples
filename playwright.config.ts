import { defineConfig, devices } from '@playwright/test';

const chrome = devices['Desktop Chrome'];

const apps = {
  nextjs: 'pnpm --filter nextjs dev',
  tanstack: 'pnpm --filter tanstack dev',
  'react-router': 'pnpm --filter react-router dev',
  waku: 'pnpm --filter waku dev',
} as const;

type FumadocsApp = keyof typeof apps;

const app = (process.env.FUMADOCS_APP ?? 'nextjs') as FumadocsApp;
const devScript = apps[app] ?? apps.nextjs;

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: `test-results/${app}`,
  use: {
    ...chrome,
    baseURL: 'http://localhost:3000',
    trace: 'off',
  },
  webServer: {
    command: devScript,
    url: 'http://localhost:3000/docs',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [{ name: app }],
  expect: { timeout: 15_000 },
});
