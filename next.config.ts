import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "pictures.abebooks.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "i5.walmartimages.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "garthnix.com",
      },
      {
        protocol: "https",
        hostname: "s3-ap-southeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.carnegielibrary.org",
      },
      {
        protocol: "https",
        hostname: "atomicbooks.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "c2.bibtopia.com",
      },
      {
        protocol: "https",
        hostname: "cdn2.penguin.com.au",
      },
    ],
  },
};

export default nextConfig;
