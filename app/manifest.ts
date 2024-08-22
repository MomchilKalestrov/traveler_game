import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Venture',
    short_name: 'Venture',
    description: 'A game to help you discover locations.',
    id: '/',
    start_url: '/',
    display: 'standalone',
    background_color: '#454937',
    theme_color: '#454937',
    icons: [
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}