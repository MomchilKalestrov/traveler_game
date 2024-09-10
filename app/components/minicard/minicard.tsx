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

    const reference = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        if(!reference.current) return;

        const ico = reference.current;
        fetch(`https://gsplsf3le8pssi3n.public.blob.vercel-storage.com/ico/${ props.name }.svg`)
        .then((res) => res.status === 200 ? res.text() : undefined)
            .then((text) => {
                if (ico && text)
                    ico.src = `data:image/svg+xml;base64,${ btoa(text) }`;
            });
    }, [props.name]);

    return (
        <>
            <button aria-label={ `View started ${ props.name }` } className={ style.Minicard } onClick={ () => setViewing(true) }>
                <h4>{ props.name }</h4>
                <Image alt={ props.name } ref={ reference } src={ `/default_assets/badge.svg` } width={ 32 } height={ 32 } />
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