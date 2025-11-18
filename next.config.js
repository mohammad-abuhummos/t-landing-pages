/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent ESLint errors from failing production builds on Railway.
  // Lint locally with `npm run lint` instead.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Similarly, do not fail the build on type errors in CI.
  typescript: {
    ignoreBuildErrors: true,
  },
};

const uploaderUrl =
  process.env.NEXT_PUBLIC_UPLOADER_URL || process.env.UPLOADER_URL;
if (uploaderUrl) {
  try {
    const parsed = new URL(uploaderUrl);
    nextConfig.images = nextConfig.images || {};
    const existing = Array.isArray(nextConfig.images.remotePatterns)
      ? nextConfig.images.remotePatterns
      : [];
    existing.push({
      protocol: parsed.protocol.replace(/:$/, ""),
      hostname: parsed.hostname,
      port: parsed.port || "",
      pathname: "/**",
    });
    nextConfig.images.remotePatterns = existing;
  } catch (error) {
    console.warn("Invalid uploader URL for remotePatterns", error);
  }
}

module.exports = nextConfig;
