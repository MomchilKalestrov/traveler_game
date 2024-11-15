import React         from 'react';
import { Metadata }  from 'next';
import { Analytics } from '@vercel/analytics/react';

import Navbar         from '@components/navbar';
import Header         from '@components/header';
import OfflineHandler from '@components/offlineHandler';
import Providers      from '@components/provider';

import { Roboto } from 'next/font/google';
import './design.css';

const roboto = Roboto({
  weight: [ '400', '500', '700', '900' ],
  subsets: [ 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Venture',
  description: 'A game to help you discover locations.',
  icons: [
    '/favicon.ico'
  ],
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <body className={ roboto.className }>
      <Analytics />
      <OfflineHandler />
      <Providers>
        <Header />
        { children }
        <Navbar pages={ [ "Home", "Map", "Profile", "Leaderboard" ] } />
      </Providers>
    </body>
  </html>
);

export default RootLayout;