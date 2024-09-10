'use client'
import React from 'react';
import style from './mapcard.module.css';
import InfoCard, { cardType } from '@components/infocard/infocard';
import Image from 'next/image';

const Mapcard = (
    props: {
        name: string,
        reset: () => void
    }
) => {
    const [viewing, setViewing] = React.useState<boolean>(false);
    const reference = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        if(!reference.current) return;

        const bg = reference.current.parentElement?.parentElement;
        fetch(`https://gsplsf3le8pssi3n.public.blob.vercel-storage.com/bg/${ props.name }.png`)
            .then((res) => res.status === 200 ? res.text() : undefined)
            .then((text) => {
                if (bg && text)
                    bg.style.backgroundImage = `url(${ text })`;
            })
        
        const ico = reference.current;
        fetch(`https://gsplsf3le8pssi3n.public.blob.vercel-storage.com/ico/${ props.name }.svg`)
            .then((res) => res.status === 200 ? res.text() : undefined)
            .then((text) => {
                if (ico && text)
                    ico.src = `data:image/svg+xml;base64,${ btoa(text) }`;
            })
    }, [props.name]);

    return (
        <>
            <div className={ style.Mapcard }>
                <div className={ style.MapcardLocation}>
                    <div>
                        <Image
                            alt={ props.name }
                            src='/default_assets/badge.svg'
                            width={ 40 }
                            height={ 40 }
                            ref={ reference }
                        />
                    </div>
                </div>
                <div className={ style.MapcardMore }>
                    <h3 style={ { margin: 0 } }>{ props.name }</h3>
                    <button
                        aria-label={ `View new ${ props.name }` }
                        className={ style.Button }
                        onClick={ () => setViewing(true) }
                    >View</button>
                </div>
            </div>
            {
                viewing &&
                <InfoCard
                    type={ cardType.Track }
                    setter={ setViewing }
                    name={ props.name }
                    reset={ props.reset }
                />
            }
        </>
    )
}

export default Mapcard;