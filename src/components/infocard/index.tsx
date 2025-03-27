'use client';
import React from 'react';
import Image from 'next/image';

import { Language, Landmark } from '@logic/types';
import LanguageCTX from '@logic/contexts/languageCTX';

import buttons, { buttonType } from './buttonTypes';

import style from './infocard.module.css';

export type { buttonType as cardType };

export type InfoCardProps = {
    close: () => void;
    type: buttonType;
    landmark: Landmark;
};

const InfoCard: React.FC<InfoCardProps> = ({ close: externalClose, type, landmark }) => {
    const reference = React.useRef<HTMLDivElement>(null);
    const language: Language | undefined = React.useContext(LanguageCTX);
    
    const Button = buttons[ type ];

    const close = () => {
        if(!reference.current) return;
        const parent = reference.current.parentElement;
        if(!parent) return;

        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out forwards`;
        parent.style.animation = `${ style.blurOut  } 0.5s ease-in-out forwards`;

        setTimeout(externalClose, 500);
    }
    console.log(landmark, language);
    if (!language) return (<></>);

    return (
        <div className={ style.Infocard }>
            <div ref={ reference }>
                <div
                    className={ style.InfocardHeader }
                    style={ {
                        backgroundImage: `
                            url('${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ landmark.dbname }.png'),
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
                    <div>
                        <Image src={ `/icons/landmark_types/${ landmark.type }.svg` } alt={ landmark.type } width={ 32 } height={ 32 } />   
                        <p>{ landmark.xp }</p>
                    </div>
                </div>
                <div className={ style.InfocardData }>
                    <h3>{ landmark.name }</h3>
                    <p>{ landmark.description }</p>
                    <Button landmark={ landmark } close={ close } language={ language } />
                </div>
            </div>
        </div>
    );
};

export default InfoCard;