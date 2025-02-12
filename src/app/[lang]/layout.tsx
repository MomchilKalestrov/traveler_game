import React from 'react';
import Script from 'next/script';

import AutoClaimHook from '@components/autoClaimHook';
import Header from '@components/header';
import Navbar from '@components/navbar';
import OfflineHandler from '@components/offlineHandler';
import SessionStorageHandler from '@components/sessionStorageHandler';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => (
    <>
        <Script
            src={ `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ process.env.NEXT_PUBLIC_ADSENSE_CLIENT }` }
            async={ true } crossOrigin='anonymous'
        />
        <OfflineHandler />
        <SessionStorageHandler />
        <AutoClaimHook />
        <Header />
            { children }
        <Navbar pages={ [ 'home', 'map', 'profile', 'leaderboard' ] } />
        <Script>{ `(adsbygoogle = window.adsbygoogle || []).push({});` }</Script>
    </>
);

export default Layout;