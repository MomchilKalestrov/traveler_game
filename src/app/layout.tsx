import { Roboto } from 'next/font/google';
import './design.css';
import { Metadata } from 'next';
import OfflineHandler from '@components/offlineHandler';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import Header from '@components/header';
import Navbar from '@components/navbar';

const roboto = Roboto({
  weight: [ '400', '500', '700', '900' ],
  subsets: [ 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Venture',
  description: 'A game to help you discover locations.',
  icons: [
    '/favicon.png'
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
      <Header />
      { children }
      <Navbar pages={ [
        "Home",
        "Map",
        "Profile",
        "Leaderboard",
      ] } />
    </body>
  </html>
);

export default RootLayout;