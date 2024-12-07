'use client';
import React from 'react';

import style from './dialog.module.css';

type DialogOption = {
    name: string;
    event?: (() => void) | undefined;
    primary?: boolean | undefined;
};

type DialogProps = {
    title?: string | undefined;
    description?: string | undefined;
    options: DialogOption[] | DialogOption;
    close: (value: React.SetStateAction<boolean>) => void;
};

const unwrap = (
    options: DialogOption[] | DialogOption,
    close: () => void
): JSX.Element => (
    Array.isArray(options)
    ?   <div className={ style.DialogOptions }>
            { options.map((option, index) => (
                <button
                    key={ index }
                    style={ !option.primary ? { border: 'none' } : undefined }
                    onClick={ () => {
                        if (option.event)
                            option.event();
                        close();
                    } }
                >{ option.name }</button>
            )) }
        </div>
    :   <div className={ style.DialogOptions }>
            <button
                style={ !options.primary ? { border: 'none' } : undefined }
                onClick={ () => {
                    if (options.event)
                        options.event();
                    close();
                } }
            >{ options.name }</button>
        </div>
);

const Dialog: React.FC<DialogProps> = ({title, description, options, close}) => {
    const reference = React.useRef<HTMLDivElement>(null);

    const closeControl = () => {
        if(!reference.current) return;
        const parent = reference.current.parentElement;
        if(!parent) return;
    
        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out forwards`;
        parent.style.animation            = `${ style.blurOut  } 0.5s ease-in-out forwards`;

        setTimeout(() => close(false), 500);
    };

    return (
        <div className={ style.Dialog }>
            <div ref={ reference }>
                <h2>{ title }</h2>
                <p>{ description }</p>
                { unwrap(options, closeControl) }
            </div>
        </div>
    );
};

export default Dialog;