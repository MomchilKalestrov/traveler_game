import React from 'react';
import Image from 'next/image';

import style                   from './infocard.module.css';
import type { location  }      from '@logic/types';
import buttons, { buttonType } from './buttonTypes';

export { buttonType as cardType };

export type InfoCardProps = {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
    type: buttonType;
    location: location;
};

const InfoCard: React.FC<InfoCardProps> = ({ setter, type, location }) => {
    const reference = React.useRef<HTMLDivElement>(null);
    const Button = buttons[type];

    const close = () => {
        if(!reference.current) return;
        const parent = reference.current.parentElement;
        if(!parent) return;

        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out forwards`;
        parent.style.animation            = `${ style.blurOut  } 0.5s ease-in-out forwards`;

        setTimeout(() => setter(false), 500);
    }

    return (
        <div className={ style.Infocard }>
            <div ref={ reference }>
                <div
                    className={ style.InfocardHeader }
                    style={ {
                        backgroundImage: `
                            url('${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ location.name }.png'),
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
                    <p>{ location.xp }</p>
                </div>
                <div className={ style.InfocardData }>
                    <h3>{ location.name }</h3>
                    <p>{ location.description }</p>
                    <Button name={ location.name } close={ close } />
                </div>
            </div>
        </div>
    );
};

export default InfoCard;