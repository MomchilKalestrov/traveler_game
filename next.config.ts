import type { NextConfig } from 'next';

const pages:   string[] = [ 'login', 'about', 'home', 'map', 'profile', 'leaderboard', 'download' ];
const locales: string[] = [ 'bg', 'en' ];

const defaultPage:   string = 'home';
const defaultLocale: string = 'en';

const downloadURL: string = (process.env.NEXT_PUBLIC_BLOB_STORAGE_URL as string) + '/' + (process.env.APK_DOWNLOAD_NAME);

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [ {
            protocol: 'https',
            hostname: process.env.NEXT_PUBLIC_BLOB_STORAGE_URL as string
        }, {
            protocol: 'https',
            hostname: 'tile.openstreetmap.org'
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
            ...locales.map(locale => ({
                source: `/${ locale }/download`,
                destination: downloadURL,
                permanent: false
            })),
            {
                source: '/',
                destination: `/${ defaultLocale }/about`,
                permanent: true
            }
        ];
    }
};

export default nextConfig;