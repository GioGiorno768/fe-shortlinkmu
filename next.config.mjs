import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      // 👇 INI YANG BENER BROK (Hapus yang 'avatar-placeholder' tadi)
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
      // Add more patterns here if needed
    ],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
