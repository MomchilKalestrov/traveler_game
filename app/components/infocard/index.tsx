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
    const reference = React.useRef<HTMLDivElement>(null);
    const paraRef = React.useRef<HTMLParagraphElement>(null);
    const Button = buttons[props.type];

    React.useEffect(() => {
        fetch(`${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/info/${ props.name }.txt`, {
            cache: 'force-cache', next: { revalidate: 60 * 60 * 24 * 30 }
        })
            .then((res) => res.status === 200 ? res.text() : undefined)
            .then((text) => {
                if (paraRef.current && text)
                    paraRef.current.innerText = text;
            });
    }, []);

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
                            url('${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ props.name }.png'),
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
                </div>
                <div className={ style.InfocardData }>
                    <h3>{ props.name }</h3>
                    <p ref={ paraRef } />
                    <Button name={ props.name } reset={ props.reset } close={ close } />
                </div>
            </div>
        </div>
    );
}

export default InfoCard;