import { Roboto } from 'next/font/google'
import './index.css'
import './design.css'
import { Metadata } from 'next';

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <>
    <html lang="en">
      <body className={ roboto.className }>{children}</body>
    </html>
    </>
  );
}
