/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
};

module.exports = nextConfig;
