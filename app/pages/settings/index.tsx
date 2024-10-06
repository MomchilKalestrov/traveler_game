import React, { useEffect } from 'react';
import style from './settings.module.css';
import Image from 'next/image';
import ToggleButton from '@app/components/toggle';
import { useRouter } from 'next/navigation';
import { deleteCookie, getCookie, setCookie } from '@logic/cookies';

const Page = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
    }
) => {
    const router = useRouter();
    const [notifAccess, setNotifAccess] = React.useState<boolean>(false);
    const reference = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.Notification.permission !== 'granted') {
            setNotifAccess(false);
            deleteCookie('notifAccess');
        }

        if (
            navigator.userAgent.toLocaleLowerCase().includes('firefox') ||
            getCookie('notifAccess')                                    || 
            !window.Notification                                        ||
            !navigator.serviceWorker
        ) setNotifAccess(true);
    }, []);

    const close = () => {
        if(!reference.current) return;
        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out forwards`;
        setTimeout(() => props.setter(false), 500);
    }

    const allowNotifications = async () => {
        setNotifAccess(true);
        if (!window.Notification || !navigator.serviceWorker) return;

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

            if((await response.json()).success) {
                alert('Subscribed to notifications.');
                return setCookie('notifAccess', 'true');
            }
            
            alert('Failed to subscribe to notifications.');
            setNotifAccess(false);
        } catch (error) {
            console.error('Error registering Service Worker:', error);
            alert('An error has occurred: \n' + error);
            setNotifAccess(false);
        }
    }

    return (
        <div ref={ reference } className={ style.Settings }>
            <div className={ style.SettingsHeader }>
                <button
                    aria-label='Close settings'
                    onClick={ close }
                    className={ style.SettingsBack }
                ><Image src='/icons/back.svg' alt='go back' width={ 24 } height={ 24 } /></button>
                <h2>Settings</h2>
                <div style={ { width: '2.5rem', height: '2.5rem' } } />
            </div>
            {/*
                <div className={ style.Option }>
                    <div>
                        <h3>Notifications</h3>
                        <p>Receive notifications for new messages and updates.</p>
                    </div>
                    <ToggleButton disabled={ notifAccess } onClick={ allowNotifications } />
                </div>
            */}
            <div className={ style.Option }>
                <div>
                    <h3>Log out</h3>
                    <p>Log out of your profile.</p>
                </div>
                <button
                    onClick={ () => {
                        deleteCookie('username');
                        deleteCookie('password');
                        router.replace('/login');
                    }
                    }
                >Log out</button>
            </div>
        </div>
    );
}

export default Page;