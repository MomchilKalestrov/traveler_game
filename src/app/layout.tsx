import React         from 'react';
import { Metadata }  from 'next';
import { Analytics } from '@vercel/analytics/react';

import Navbar         from '@components/navbar';
import Header         from '@components/header';
import OfflineHandler from '@components/offlineHandler';
import Providers      from '@components/providers';

import { Roboto } from 'next/font/google';
import './design.css';
import SessionStorageHandler from '@src/components/sessionStorageHandler';

const roboto = Roboto({
    weight: [ '400', '500', '700', '900' ],
    subsets: [ 'latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Venturo',
    description: 'A game where you earn rewards by visiting the sights of Bulgaria.',
    icons: [ '/favicon.ico', '/favicon.png' ],
};

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => (
    <html lang="en">
        <body className={ roboto.className }>
            <OfflineHandler />
            <SessionStorageHandler />
            
            <Analytics />

            <Providers>
                <Header />
                { children }
                <Navbar pages={ [ 'home', 'map', 'profile', 'leaderboard' ] } />
            </Providers>
        </body>
    </html>
);

export default RootLayout;