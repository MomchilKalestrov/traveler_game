'use client'
import React, { useEffect, useState } from 'react';
import style from './minicard.module.css';
import { useRouter } from 'next/navigation';
import loading from './loading';

const MinicardInfo = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
        name: string
    }
) => {
    const router = useRouter();
    const reference: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

    const Close = () => {
        if(!reference.current) return;
        const parent = reference.current.parentElement;
        if(!parent) return;

        reference.current.style.animation = `${ style.slideOut } 0.5s ease-in-out`;
        parent.style.animation            = `${ style.blurOut  } 0.5s ease-in-out`;

        setTimeout(() => props.setter(false), 500);
    }

    const untrack = () => {
        loading();
        fetch(`/api/untrack`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ name: props.name })
        })
            .then(response => response.json())
            .then(data => {
                if(data.error) return console.log(data.error);
                window.location.reload();
            });
    }

    return (
        <div className={ style.MinicardInfo }>
            <div ref={ reference }>
                <div className={ style.MinicardInfoHeader }>
                    <img src='/back.svg' alt='back' onClick={ Close } />
                </div>
                <div className={ style.MapcardInfoData }>
                    <h3>{ props.name }</h3>
                    <p></p>
                    <button className={ style.MinicardButton } onClick={ untrack }>Stop tracking</button>
                </div>
            </div>
        </div>
    );
}


const Minicard = (
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
            <div className={ style.Minicard } onClick={ () => setViewing(true) }>
                <p>{ props.name }</p>
                <img src={ `/badges/${ props.name }.svg` } alt={ props.name } />
            </div>
            { viewing ? <MinicardInfo setter={ setViewing } name={ props.name } /> : <></> }
        </>
    )
}

export default Minicard;