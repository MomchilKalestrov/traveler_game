'use client'
import React, { useEffect, useState } from 'react';
import style from './mapcard.module.css';
import InfoCard from './infocard';

const Mapcard = (
    props: {
        name: string
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
    }, [props.name]);

    return (
        <>
            <div className={ style.Mapcard }>
                <div ref={ reference } className={ style.MapcardLocation} onLoad={ SetBG }>
                    <img src={ `/badges/${ props.name }.svg`} />
                </div>
                <div className={ style.MapcardMore }>
                    <p className={ style.MapcardTitle }>{ props.name }</p>
                    <button className={ style.Button } onClick={ () => setViewing(true) }>View</button>
                </div>
            </div>
            { viewing ? <InfoCard track={ true } setter={ setViewing } name={ props.name } /> : <></> }
        </>
    )
}

export default Mapcard;