import type { NextConfig } from 'next';

const pages:   string[] = [ 'login', 'about', 'home', 'map', 'profile', 'leaderboard' ];
const locales: string[] = [ 'bg', 'en' ];

const defaultPage:   string = 'home';
const defaultLocale: string = 'en';

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
            ...locales.map(locale => ({
                source: `/${ locale }`,
                destination: `/${ locale }/${ defaultPage }`,
                permanent: true
            })),
            ...pages.map(page => ({
                source: `/${ page }`,
                destination: `/${ defaultLocale }/${ page }`,
                permanent: true
            })),
            {
                source: '/',
                destination: `/${ defaultLocale }/home`,
                permanent: true
            }
        ];
    }
};

export default nextConfig;