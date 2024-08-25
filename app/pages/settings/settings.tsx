import React, { useEffect } from 'react';
import style from './settings.module.css';
import Image from 'next/image';
import ToggleButton from '@app/components/toggle/toggle';

const waitForServiceWorkerActivation = async (registration: any) => {
    if (!navigator.serviceWorker.controller) {
        await new Promise((resolve) => {
            navigator.serviceWorker.addEventListener('controllerchange', function onControllerChange() {
                navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
                resolve(null);
            });
        });
    }
    return registration;
};

const Page = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
    }
) => {
    const [notifAccess, setNotifAccess] = React.useState<boolean>(false);
    const reference = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (navigator.userAgent.toLocaleLowerCase().includes('firefox')) setNotifAccess(true);
    }, []);

    const close = () => {
        if(!reference.current) return;
        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out`;
        setTimeout(() => props.setter(false), 500);
    }

    const allowNotifications = async () => {
        if(!window.Notification || !navigator.serviceWorker) return;

        try {
            const permission = await Notification.requestPermission();
            if(permission !== 'granted') return console.error('Permission not granted for Notification');
            const registration = await navigator.serviceWorker.register('/notificationsWorker.js');
            console.log('Service Worker registered:', registration);
            
            console.log(registration.active);
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BLHIkvcg6jS1TYx4vpkVVGULrdKAiWvC7c6rxh7Dp8V1kkP6MVGPlPhz5_I5S5fbV1-wM4cJrKWHQfqJ0SlZ_4o'
            });

            const response = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });

            alert((await response.json() as any).success);

            if((await response.json()).success)
                console.log('Subscribed to notifications.');
            else
                console.error('Failed to subscribe to notifications.');
        } catch (error) {
            console.error('Error registering Service Worker:', error);
            alert('An error has occurred: \n' + error);
        }
    }

    return (
        <div ref={ reference } className={ style.Settings }>
            <div className={ style.SettingsHeader }>
                <button
                    aria-label='Close settings'
                    onClick={ close }
                    className={ style.SettingsBack }
                ><Image src='/icons/back.svg' alt='go back' width={ 32 } height={ 32 } /></button>
                <h2>Settings</h2>
                <div style={ { 
                    width: '2.5rem',
                    height: '2.5rem'
                } } />
            </div>
            <div className={ style.Option }>
                <h3>Notifications</h3>
                <ToggleButton disabled={ notifAccess } onClick={ allowNotifications } />
            </div>
        </div>
    );
}

export default Page;