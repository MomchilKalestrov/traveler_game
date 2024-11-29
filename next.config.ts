import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [ {
            protocol: 'https',
            hostname: 'gsplsf3le8pssi3n.public.blob.vercel-storage.com',
        } ]
    },
    async redirects() {
        return [
            {
                source: '/bg',
                destination: '/bg/home',
                permanent: true
            },
            {
                source: '/en',
                destination: '/en/home',
                permanent: true
            },
            {
                source: '/',
                destination: '/bg/home',
                permanent: true
            }
        ];
    }
};

export default nextConfig;