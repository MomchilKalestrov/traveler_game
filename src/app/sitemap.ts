import type { MetadataRoute } from 'next';

const baseURL = 'https://traveler-game.vercel.app';

const sitemap = (): MetadataRoute.Sitemap => ([
    {
        url: baseURL + '/',
        lastModified: '01-11-2024',
        changeFrequency: 'never'
    },
    {
        url: baseURL + '/leaderboard',
        lastModified: '01-11-2024',
        changeFrequency: 'monthly'
    },
    {
        url: baseURL + '/profile',
        lastModified: '01-11-2024',
        changeFrequency: 'weekly'
    },
    {
        url: baseURL + '/map',
        lastModified: '01-11-2024',
        changeFrequency: 'weekly'
    },
    {
        url: baseURL + '/home',
        lastModified: '01-11-2024',
        changeFrequency: 'weekly'
    },
    {
        url: baseURL + '/login',
        lastModified: '01-11-2024',
        changeFrequency: 'monthly'
    }
]);

export default sitemap;