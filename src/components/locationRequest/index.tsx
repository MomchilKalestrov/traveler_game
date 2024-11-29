'use client';
import React from 'react';

import LanguageCTX  from '@logic/contexts/languageCTX';
import { Language } from '@logic/types';

import style from './request.module.css';

type RequestProps = {
    setPermission: (hasGPSAccess: boolean) => void;
};

const LocationRequest: React.FC<RequestProps> = ({ setPermission }) => {
    const language: Language | undefined = React.useContext(LanguageCTX);

    const reference = React.useRef<HTMLDivElement>(null);

    const close = () => {
        if(!reference.current) return;
        const parent = reference.current.parentElement;
        if(!parent) return;
    
        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out forwards`;
        parent.style.animation            = `${ style.blurOut  } 0.5s ease-in-out forwards`;
    }

    const accept = () =>
        navigator.geolocation.getCurrentPosition(() => {
            close();
            setTimeout(() => setPermission(true), 500);
        });

    const decline = () => {
        close();
        setTimeout(() => setPermission(false), 500);
    }

    if(!language) return (<></>);

    return (
        <div className={ style.Infocard }>
            <div ref={ reference }>
                <h3>{ language.misc.GPSaccess.title }</h3>
                <p>{ language.misc.GPSaccess.title }</p>
                <button onClick={ accept  }>{ language.misc.GPSaccess.accept  }</button>
                <button onClick={ decline }>{ language.misc.GPSaccess.decline }</button>
            </div>
        </div>
    );
};

export default LocationRequest;