import { Roboto } from 'next/font/google'
import './index.css'

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ['cyrillic', 'latin']
})

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
