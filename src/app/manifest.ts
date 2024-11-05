import type { MetadataRoute } from 'next'
 
const manifest = (): MetadataRoute.Manifest => ({
  name: 'Venture',
  short_name: 'Venture',
  description: 'A game to help you discover locations.',
  id: '/',
  start_url: '/',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  background_color: '#454937',
  theme_color: '#454937',
  file_handlers: [],
  icons: [
    {
      src: '/favicon.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: '/favicon.ico',
      sizes: '256x256 128x128',
      type: 'image/x-icon'
    }
  ],
})

export default manifest;