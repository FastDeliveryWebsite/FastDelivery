/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Prevents Windows EBUSY / ENOENT file rename lock issues on .pack.gz
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
