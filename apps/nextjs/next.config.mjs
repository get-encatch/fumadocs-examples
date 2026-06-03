import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
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
