'use client'
import React, { useEffect, useState } from 'react';
import style from './mapcard.module.css';
import InfoCard, { cardType } from '@components/infocard/infocard';
import Image from 'next/image';

const Mapcard = (
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
            //reference.current.style.backgroundImage = `url('https://maps.googleapis.com/maps/api/staticmap?center=${ props.name },Bulgaria&zoom=13&size=${width + 65}x${Math.round((width + 65) / (width / height))}&maptype=satellite&style=feature:all|element:labels|visibility:off&key=AIzaSyBPYpCcdRsOe4Mci-EkrfBKwNAwwLQzTQ0')`;
            reference.current.style.backgroundSize = `${width + 65}px ${(width + 65) / (width / height)}px`;
        }
    };

    useEffect(() => {
        SetBG();
    }, []);

    return (
        <>
            <div className={ style.Mapcard }>
                <div ref={ reference } className={ style.MapcardLocation} onLoad={ SetBG }>
                    <div><Image alt={ props.name } src={ `/locations/badges/${ props.name }.svg`} width={ 40 } height={ 40 } /></div>
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