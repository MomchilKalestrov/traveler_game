'use client'
import React, { useEffect, useState } from 'react';
import style from './mapcard.module.css'

const MapcardInfo = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
        name: string
    }
) => {
    const reference: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

    const Close = () => {
        if(!reference.current) return;
        const parent = reference.current.parentElement;
        if(!parent) return;

        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out`;
        parent.style.animation            = `${ style.blurOut  } 0.5s ease-in-out`;

        setTimeout(() => props.setter(false), 500);
    }

    return (
        <div className={ style.MapcardInfo }>
            <div ref={ reference }>
                <div className={ style.MapcardInfoHeader }>
                    <img src='/back.svg' alt='back' onClick={ Close } />
                    <p>{ props.name }</p>
                </div>
            </div>
        </div>
    );
}


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

    const ViewDetails = () => {
        setViewing(true);
        console.log('Viewing details');
    }

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
                    <button onClick={ ViewDetails }>View</button>
                </div>
            </div>
            { viewing ? <MapcardInfo setter={ setViewing } name={ props.name } /> : <></> }
        </>
    )
}

export default Mapcard;