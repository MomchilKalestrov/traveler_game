import React from 'react';
import { Roboto }    from 'next/font/google';
import { Metadata }  from 'next';
import { Analytics } from '@vercel/analytics/react';

import Providers from '@components/providers';

import './design.css';

const roboto = Roboto({
    weight: [ '400', '500', '700', '900' ],
    subsets: [ 'latin'],
    display: 'swap',
});

const metadata: Metadata = {
    title: 'Venturo',
    description: 'A game where you earn rewards by visiting the sights of Bulgaria.',
    icons: [ '/favicon.ico', '/favicon.png' ],
    openGraph: { images: '/api/open-graph' },
    metadataBase: new URL(process.env.APPLICATION_URL as string)
};

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => (
    <html lang="en">
        <body className={ roboto.className }>
            <Analytics />
            <Providers>
                { children }
            </Providers>
        </body>
    </html>
);

export default RootLayout;
export { metadata };