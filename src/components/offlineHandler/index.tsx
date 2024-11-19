'use client';
import React, { CSSProperties } from 'react';

const style: CSSProperties = {
    position: 'fixed',
    left: '50%',
    bottom: '5rem',
    transform: 'translateX(calc(-50% - 1rem))',
    margin: '1rem',
    padding: '0.25rem 0.5rem',
    textAlign: 'center',
    backgroundColor: 'var(--color-secondary)',
    borderRadius: '0.25rem',
    lineHeight: '1.25rem',
    fontSize: '1rem',
};

const OfflineHandler: React.FC = () => {
    
    const [ isOffline, setConnection ] = React.useState<boolean>(navigator ? !navigator.onLine : false);

    const offline = () => setConnection(true);
    const online  = () => setConnection(false);

    React.useEffect(() => {
        window.addEventListener('offline', offline);
        window.addEventListener('online', online);
        if (!navigator) return;
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register('/offlineWorker.js')
                .then((registration) => console.log("ServiceWorker registration successful with scope: ", registration.scope))
                .catch((error) =>       console.error("ServiceWorker registration failed: ", error));
        }
        return () => {
            window.removeEventListener('offline', offline);
            window.removeEventListener('online', online);
        };
    }, []);

    return isOffline && <div style={ style }>you are offline</div>;
};

export default OfflineHandler;