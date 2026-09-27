/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Dusty pages that moved from static HTML into the app (old links keep working)
      { source: '/projects/nolan/invention-packet.html', destination: '/projects/nolan/dusty/packet', permanent: false },
      { source: '/projects/nolan/research.html', destination: '/projects/nolan/dusty/research', permanent: false },
      { source: '/projects/nolan/dusty.html', destination: '/projects/nolan/dusty/invention', permanent: false },
      // Print plan and the old static build guide merged into the Build Guide (Sep 27 2026)
      { source: '/projects/nolan/dusty/build/batches', destination: '/projects/nolan/dusty/build/guide', permanent: false },
      { source: '/projects/nolan/dusty-build-guide.html', destination: '/projects/nolan/dusty/build/guide', permanent: false },
    ];
  },
};

module.exports = nextConfig;
