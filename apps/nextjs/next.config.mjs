import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // Turbopack resolves `next` from the workspace root (see root package.json).
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/en' },
        { source: '/docs', destination: '/en/docs' },
        { source: '/docs/:path*', destination: '/en/docs/:path*' },
      ],
    };
  },
};

export default withMDX(config);
