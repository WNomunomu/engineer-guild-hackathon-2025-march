import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["ndlsearch.ndl.go.jp", "books.google.com", "placehold.co"], // NDLの書影APIの画像表示のため, google books apiの(ry
  },

  webpack(config) {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
};

export default nextConfig;
