import style from './infocard.module.css';
import React from 'react';
import Image from 'next/image';
import buttons from './buttonTypes';
import type { location  } from '@logic/types';

export enum cardType {
    Untrack,
    Track,
    Finish
};

const InfoCard = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
        type: cardType,
        reset: () => void,
        location: location
    }
) => {
    const reference = React.useRef<HTMLDivElement>(null);
    const Button = buttons[props.type];

    const close = () => {
        if(!reference.current) return;
        const parent = reference.current.parentElement;
        if(!parent) return;

        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out forwards`;
        parent.style.animation            = `${ style.blurOut  } 0.5s ease-in-out forwards`;

        setTimeout(() => props.setter(false), 500);
    }

    return (
        <div className={ style.Infocard }>
            <div ref={ reference }>
                <div
                    className={ style.InfocardHeader }
                    style={ {
                        backgroundImage: `
                            url('${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ props.location.name }.png'),
                            url('/default_assets/background.png')
                        `
                    } }
                >
                    <button aria-label='Close card' onClick={ close }>
                        <Image
                            src='/icons/back.svg' alt='back'
                            width={ 32 } height={ 32 }
                        />
                    </button>
                    <p>{ props.location.xp }</p>
                </div>
                <div className={ style.InfocardData }>
                    <h3>{ props.location.name }</h3>
                    <p>{ props.location.description }</p>
                    <Button name={ props.location.name } reset={ props.reset } close={ close } />
                </div>
            </div>
        </div>
    );
}

export default InfoCard;