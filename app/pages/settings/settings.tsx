import React from 'react';
import style from './settings.module.css';

const Page = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
    }
) => {
    const reference = React.useRef<HTMLDivElement>(null);

    const close = () => {
        if(!reference.current) return;

        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out`;

        setTimeout(() => props.setter(false), 500);
    }

    return (
        <div ref={ reference } className={ style.Settings }>
            <div className={ style.SettingsHeader }>
                <button
                    aria-label='Close settings'
                    onClick={ close }
                    className={ style.SettingsBack }
                ><img src='/icons/back.svg' /></button>
                <h2>Settings</h2>
                <div style={ { 
                    width: '2.5rem',
                    height: '2.5rem'
                } } />
            </div>
        </div>
    );
}

export default Page;