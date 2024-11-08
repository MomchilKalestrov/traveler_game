'use client';
import React from 'react';
import style from './request.module.css';

type RequestProps = {
    setPermission: (hasGPSAccess: boolean) => void;
};

const LocationRequest: React.FC<RequestProps> = ({ setPermission }) => {
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

    return (
        <div className={ style.Infocard }>
            <div ref={ reference }>
                <h3>Location</h3>
                <p>You will need to allow geolocation to claim badges.</p>
                <button onClick={ accept  }>Allow</button>
                <button onClick={ decline }>Deny</button>
            </div>
        </div>
    );
};

export default LocationRequest;