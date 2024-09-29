import style from './infocard.module.css';
import React from 'react';
import Image from 'next/image';
import buttons from './buttonTypes';

export enum cardType {
    Untrack,
    Track,
    Finish
};

const InfoCard = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
        name: string,
        type: cardType,
        reset: () => void
    }
) => {
    const reference= React.useRef<HTMLDivElement>(null);
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
        <div className={ style.Infocard } onClick={ close }>
            <div ref={ reference }>
                <div className={ style.InfocardHeader }>
                    <button aria-label='close card' onClick={ close }>
                        <Image
                            src='/icons/back.svg' alt='back'
                            width={ 32 } height={ 32 }
                            onLoad={ (event: React.SyntheticEvent<HTMLImageElement>) =>
                                fetch(`${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ props.name }.png`, {
                                    cache: 'force-cache', next: { revalidate: 60 * 60 * 24 * 30 }
                                })
                                    .then((res) => res.status === 200 ? res.text() : undefined)
                                    .then((text) => {
                                        if (event.currentTarget && text)
                                            event.currentTarget.style.backgroundImage = `url(${ text })`;
                                    })
                            }
                        />
                    </button>
                </div>
                <div className={ style.InfocardData }>
                    <h3>{ props.name }</h3>
                    <p></p>
                    <Button name={ props.name } reset={ props.reset } close={ close } />
                </div>
            </div>
        </div>
    );
}

export default InfoCard;