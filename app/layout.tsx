import { Roboto } from 'next/font/google';
import './design.css';
import { Metadata } from 'next';
import OfflineHandler from '@components/offlineHandler';
import { Analytics } from '@vercel/analytics/react';

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
      <OfflineHandler>
        { children }
      </OfflineHandler>
    </body>
  </html>
);

export default RootLayout;