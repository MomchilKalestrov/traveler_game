'use client';
import React         from 'react';
import { useRouter } from 'next/navigation';
import Image         from 'next/image';

import { deleteCookie } from '@logic/cookies';

import style from './settings.module.css';

const Settings = ({ close }: { close: () => void }) => {
    const router = useRouter();
    const reference = React.useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (reference.current)
            reference.current.style.animation = `${ style.SlideOut } 0.5s forwards`;
        setTimeout(close, 500);
    }

    React.useEffect(() => {
        if (!reference.current) return;
    }, []);

    return (
        <div ref={ reference } className={ style.Settings }>
            <div className={ style.SettingsHeader }>
                <button
                    aria-label='Close settings'
                    onClick={ handleClick }
                    className={ style.SettingsBack }
                ><Image src='/icons/back.svg' alt='go back' width={ 24 } height={ 24 } /></button>
                <h2>Settings</h2>
                <div style={ { width: '2.5rem', height: '2.5rem' } } />
            </div>
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

export default Settings;