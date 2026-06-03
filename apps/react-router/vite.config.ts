import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import mdx from 'fumadocs-mdx/vite';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [mdx(), tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      'collections/server': path.resolve(root, '.source/server.ts'),
      'collections/browser': path.resolve(root, '.source/browser.ts'),
    },
  },
  ssr: {
    external: ['@takumi-rs/image-response'],
  },
});
