'use client';
import React         from 'react';
import { useRouter } from 'next/navigation';
import Image         from 'next/image';

import { deleteCookie, getCookie, setCookie } from '@logic/cookies';
import { Language } from '@logic/types';
import LanguageCTX  from '@logic/contexts/languageCTX';

import Dropdown from '@components/dropdown';

import style    from './settings.module.css';

type SettingsProps = {
    close: () => void;
};

const Settings = ({ close }: SettingsProps) => {
    const router = useRouter();
    const language: Language | undefined = React.useContext(LanguageCTX);
    const reference = React.useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (reference.current)
            reference.current.style.animation = `${ style.SlideOut } 0.5s forwards`;
        setTimeout(close, 500);
    };

    React.useEffect(() => {
        if (!reference.current) return;
    }, []);

    if (!language) return (<></>);

    return (
        <div ref={ reference } className={ style.Settings }>
            <div className={ style.SettingsHeader }>
                <button
                    aria-label='Close settings'
                    onClick={ handleClick }
                    className={ style.SettingsBack }
                ><Image src='/icons/back.svg' alt='go back' width={ 24 } height={ 24 } /></button>
                <h2>{ language.misc.settings.title }</h2>
                <div style={ { width: '2.5rem', height: '2.5rem' } } />
            </div>
            <div className={ style.Option }>
                <div>
                    <h3>{ language.misc.settings.language.title }</h3>
                    <p>{ language.misc.settings.language.description }</p>
                </div>
                <Dropdown
                    name={ language.misc.settings.language.title }
                    width='8.5rem' selected={ language.locale }
                    entries={ { 'English': 'en', 'Български': 'bg' } }
                    onClick={ (_, value) => {
                        setCookie('locale', value);
                        sessionStorage.removeItem('initialSave');
                        alert(language.misc.settings.language.alert);
                    } }
                />
            </div>
            <div className={ style.Option }>
                <div>
                    <h3>{ language.misc.settings.logout.title }</h3>
                    <p>{ language.misc.settings.logout.description }</p>
                </div>
                <button
                    onClick={ () => {
                            sessionStorage.removeItem("initialSave");
                            deleteCookie('username');
                            deleteCookie('password');
                            router.replace('/login');
                        }
                    }
                >{ language.misc.settings.logout.title }</button>
            </div>
        </div>
    );
};

export default Settings;
