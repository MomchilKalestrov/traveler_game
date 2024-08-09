import { Noto_Sans } from 'next/font/google'
import './index.css'

const font = Noto_Sans({
  subsets: ['latin'],
  display: 'swap'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <>
    <html lang="en">
      <body className={ font.className }>{children}</body>
    </html>
    </>
  );
}
