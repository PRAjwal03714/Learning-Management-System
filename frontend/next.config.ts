
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://lms-backend-38al.onrender.com',
  },
  reactStrictMode: true,
};

export default nextConfig;
