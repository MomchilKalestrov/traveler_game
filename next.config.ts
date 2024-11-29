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
                source: '/login',
                destination: '/en/login',
                permanent: true
            },
            {
                source: '/home',
                destination: '/en/home',
                permanent: true
            },
            {
                source: '/map',
                destination: '/en/map',
                permanent: true
            },
            {
                source: '/profile',
                destination: '/en/profile',
                permanent: true
            },
            {
                source: '/leaderboard',
                destination: '/en/leaderboard',
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