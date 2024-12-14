import type { MetadataRoute } from 'next';

const baseURL = 'https://traveler-game.vercel.app';

const pages: string[] = [ 'login', 'about', 'home', 'map', 'profile', 'leaderboard', 'about', 'download' ];
const languages: string[] = [ 'bg', 'en' ];

const sitemap = (): MetadataRoute.Sitemap => ([
    ... languages.flatMap(language =>
            pages.map(page => ({
                url: `${ baseURL }/${ language }/${ page }`,
                lastModified: '14-12-2024',
                changeFrequency: 'weekly' as 'weekly',
            }))
        )
]);

export default sitemap;