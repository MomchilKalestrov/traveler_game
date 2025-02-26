'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { preloadFromSessionStorage } from '@logic/redux/sessionStorage';

const isHidden = (url: string): boolean => {
    const hidden: string[] = [ 'login', 'about' ];
    let hide = false;

    hidden.forEach((page) => hide = (hide || url.includes(page)));
    
    return hide;
};

const SessionStorageHandler: React.FC = () => {
    const pathname = usePathname();
    
    React.useEffect(() => {
        if (isHidden(pathname)) return;
        preloadFromSessionStorage();
    }, [ pathname ]);

    return (<></>);
};

export default SessionStorageHandler;