import React from 'react';

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
        <OfflineHandler />
        <SessionStorageHandler />
        <AutoClaimHook />
        <Header />
            { children }
        <Navbar pages={ [ 'home', 'map', 'profile', 'leaderboard' ] } />
    </>
);

export default Layout;