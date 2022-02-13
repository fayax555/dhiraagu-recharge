/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  sassOptions: {
    prependData: `@use 'variables' as *;`,
  },
}

module.exports = nextConfig
