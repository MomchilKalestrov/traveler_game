import { Roboto } from 'next/font/google'
import './index.css'
import './colorSchema.css'
import { Metadata } from 'next';

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ['cyrillic', 'latin']
})

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
