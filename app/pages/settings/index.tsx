import React from 'react';
import style from './settings.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deleteCookie } from '@logic/cookies';
import { SettingsVisibleCTX } from '@logic/context';

const Page = () => {
    const router = useRouter();
    const reference = React.useRef<HTMLDivElement>(null);
    const settingsCTX = React.useContext(SettingsVisibleCTX);
    const visible = settingsCTX?.visible;
    const setVisible = settingsCTX?.setVisible || (() => {});

    React.useEffect(() => {
        setVisible(false);
        if (!reference.current) return;
        reference.current.style.transition = 'transform 0.5s ease-in-out';
    }, [setVisible]);

    React.useEffect(() => {
        if(!reference.current) return;
        reference.current.style.transform = visible ? 'translateX(0)' : 'translateX(100%)';
    }, [visible]);

    return (
        <div ref={ reference } className={ style.Settings }>
            <div className={ style.SettingsHeader }>
                <button
                    aria-label='Close settings'
                    onClick={ () => setVisible(false) }
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

export default Page;