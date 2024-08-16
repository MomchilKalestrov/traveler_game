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
            <button onClick={ close } className={ style.SettingsBack }><img src='/back.svg' /></button>
            <h1>Settings</h1>
            <p>Change your settings here.</p>
        </div>
    );
}

export default Page;