import { createSecureHeaders } from "next-secure-headers";

const hostnames = [
  "avatars.githubusercontent.com",
  "lh3.googleusercontent.com",
  "githubusercontent.com",
  "googleusercontent.com",
  "images.unsplash.com",
  "cdn.discordapp.com",
  "res.cloudinary.com",
  "www.gravatar.com",
  "api.dicebear.com",
  "img.youtube.com",
  "discordapp.com",
  "pbs.twimg.com",
  "i.imgur.com",
  "utfs.io",
  "asset.kompas.com",
  "images.pexels.com",
  "images.unsplash.com"
];

const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: hostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
    unoptimized: true, // Disable Image Optimization for export
  },
  
  /**
  * Set custom website headers with next-secure-headers.
  * @see https://github.com/jagaapple/next-secure-headers
  */
  async headers() {
    if (!isExport) {
      return [
        {
          /**
           * Set security headers to all routes.
           */
          source: "/(.*)",
          headers: createSecureHeaders(),
        },
      ];
    }
    return [];
  },
  /**
   * Dangerously allow builds to successfully complete
   * even if your project has the types/eslint errors.
   *
   * Next.js has built-in support for TypeScript, using its own plugin.
   * But while you use `pnpm build`, it stops on the first type errors.
   * So you can use `pnpm bv` to check all type warns and errors at once.
   */
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
