'use client';
import React from 'react';

const OfflineHandler = ({ children }: { children: React.ReactNode }) => {
    React.useEffect(() => {
        console.log('OfflineHandler mounted');
        if (!navigator) return;
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register('/offlineWorker.js')
                .then((registration) => {
                    console.log("ServiceWorker registration successful with scope: ", registration.scope);
                })
                .catch((error) => {
                    console.error("ServiceWorker registration failed: ", error);
                });
        }
    }, []);

    return <>{ children }</>;
};

export default OfflineHandler;