'use client'
import React from 'react';
import style from './minicard.module.css';
import InfoCard, { cardType } from '@components/infocard/infocard';
import Image from 'next/image';

const Minicard = (
    props: {
        name: string,
        reset: () => void
    }
) => {
    const [viewing, setViewing] = React.useState<boolean>(false);

    const reference: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if(reference.current) {
            const width = reference.current.offsetWidth;
            const height = reference.current.offsetHeight
            //reference.current.style.backgroundImage = ``;
            reference.current.style.backgroundSize = `${width + 65}px ${(width + 65) / (width / height)}px`;
        }
    }, [props.name]);

    return (
        <>
            <button aria-label={ `View started ${ props.name }` } className={ style.Minicard } onClick={ () => setViewing(true) }>
                <h3>{ props.name }</h3>
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