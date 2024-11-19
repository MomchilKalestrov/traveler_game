import type { MetadataRoute } from 'next';

const sitemap: MetadataRoute.Sitemap = ([
    {
        url: '/',
        lastModified: new Date('01-11-2024'),
        changeFrequency: 'never'
    },
    {
        url: 'leaderboard',
        lastModified: new Date('01-11-2024'),
        changeFrequency: 'monthly'
    },
    {
        url: 'profile',
        lastModified: new Date('01-11-2024'),
        changeFrequency: 'weekly'
    },
    {
        url: 'map',
        lastModified: new Date('01-11-2024'),
        changeFrequency: 'weekly'
    },
    {
        url: 'home',
        lastModified: new Date('01-11-2024'),
        changeFrequency: 'weekly'
    },
    {
        url: 'login',
        lastModified: new Date('01-11-2024'),
        changeFrequency: 'monthly'
    }
]);

export default sitemap;