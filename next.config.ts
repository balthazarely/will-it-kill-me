import type { NextConfig } from "next";
// @ts-ignore
import withPWA from "next-pwa";

const nextConfig: NextConfig = {};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);
