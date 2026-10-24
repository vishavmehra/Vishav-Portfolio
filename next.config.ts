import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The dev overlay's badge ("N Issues") sits over the world in the bottom-left
  // corner. It never ships, but it also has no business in a screenshot.
  devIndicators: false,
}

export default nextConfig
