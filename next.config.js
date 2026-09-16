/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Dusty pages that moved from static HTML into the app (old links keep working)
      { source: '/projects/nolan/invention-packet.html', destination: '/projects/nolan/dusty/packet', permanent: false },
      { source: '/projects/nolan/research.html', destination: '/projects/nolan/dusty/research', permanent: false },
      { source: '/projects/nolan/dusty.html', destination: '/projects/nolan/dusty/invention', permanent: false },
    ];
  },
};

module.exports = nextConfig;
