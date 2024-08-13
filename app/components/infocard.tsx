import style from './infocard.module.css';
import { useRouter } from "next/navigation";
import React from "react";
import loading from './loading';

const InfoCard = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
        name: string,
        track: boolean
    }
) => {
    const router = useRouter();
    const reference: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

    const close = () => {
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
    
    const track = () => {
        loading();
        fetch(`/api/track`, {
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
        <div className={ style.Infocard }>
            <div ref={ reference }>
                <div className={ style.InfocardHeader }>
                    <img src='/back.svg' alt='back' onClick={ close } />
                </div>
                <div className={ style.InfocardData }>
                    <h3>{ props.name }</h3>
                    <p></p>
                    {
                        props.track
                        ? <button className={ `${ style.InfocardButton } ${ style.InfocardGreen }` } onClick={ track   }>Start tracking</button>
                        : <button className={ `${ style.InfocardButton } ${ style.InfocardRed   }` } onClick={ untrack }>Stop tracking</button>
                    }
                </div>
            </div>
        </div>
    );
}

export default InfoCard;