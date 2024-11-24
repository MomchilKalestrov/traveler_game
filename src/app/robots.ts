import type { MetadataRoute } from 'next';

const baseURL = 'https://traveler-game.vercel.app';

const robots = (): MetadataRoute.Robots =>  ({
    rules: [
        {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/_next/',
                '/_vercel/',
                '/_assets/',
                '/_logs/',
                '/_vercel_log'
            ]
        },
        {
            userAgent: 'GPTBot',
            disallow: '/'
        },
        {
            userAgent: 'ChatGPT-User',
            disallow: '/'
        },
        {
            userAgent: 'OAI-SearchBot',
            disallow: '/'
        }
    ],
    sitemap: baseURL + '/sitemap.xml'
});

export default robots;