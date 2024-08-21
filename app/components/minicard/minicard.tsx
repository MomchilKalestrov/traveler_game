'use client'
import React, { useEffect, useState } from 'react';
import style from './minicard.module.css';
import InfoCard, { cardType } from '@components/infocard/infocard';
import Image from 'next/image';

const Minicard = (
    props: {
        name: string,
        reset: () => void
    }
) => {
    const [viewing, setViewing] = useState<boolean>(false);

    const reference: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

    const SetBG = () => {
        if(reference.current) {
            const width = reference.current.offsetWidth;
            const height = reference.current.offsetHeight
            //reference.current.style.backgroundImage = ``;
            reference.current.style.backgroundSize = `${width + 65}px ${(width + 65) / (width / height)}px`;
        }
    };

    useEffect(() => {
        SetBG();
    }, [props.name]);

    return (
        <>
            <button aria-label={ `View started ${ props.name }` } className={ style.Minicard } onClick={ () => setViewing(true) }>
                <p>{ props.name }</p>
                <Image alt={ props.name } src={ `/badges/${ props.name }.svg` } width={ 32 } height={ 32 } />
            </button>
            {
                viewing &&
                <InfoCard
                    type={ cardType.Untrack }
                    setter={ setViewing }
                    name={ props.name }
                    reset={ props.reset }
                />
            }
        </>
    )
}

export default Minicard;