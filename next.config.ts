import type { NextConfig } from "next";
// @ts-ignore
import withPWA from "next-pwa";

const nextConfig: NextConfig = {};

const config = process.env.NODE_ENV === "production"
  ? withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV !== "production",
    })(nextConfig)
  : nextConfig;

export default config;
