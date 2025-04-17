/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_ROOT: process.env.NEXT_PUBLIC_API_ROOT,
  },
};

export default nextConfig;
