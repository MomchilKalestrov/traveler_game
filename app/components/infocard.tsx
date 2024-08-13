import style from './infocard.module.css';
import { useRouter } from "next/navigation";
import React from "react";
import loading from './loading';

export enum cardType {
    Untrack,
    Track,
    Finish
};

const getUserLocation = (): { lat: number, lng: number } | undefined => {
    let userLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                (error) => console.error('Error getting user location:', error)
            );
        } else {
            alert('Geolocation is not supported by this browser.');
            return undefined;
        }
    } catch {
        alert('Geolocation is not supported by this browser.');
        return undefined;
    };

    console.log(userLocation);
    return userLocation;
};

const untrack = (name: string) => {
    loading();
    fetch(`/api/untrack`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ name: name })
    })
        .then(response => response.json())
        .then(data => {
            if(data.error) return console.log(data.error);
            window.location.reload();
        });
}

const track = (name: string) => {
    loading();
    fetch(`/api/track`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ name: name })
    })
        .then(response => response.json())
        .then(data => {
            if(data.error) return console.log(data.error);
            window.location.reload();
        });
}

const finish = (name: string) => {
    const userLocation = getUserLocation();
    if(!userLocation) return;

    loading();
    fetch(`/api/finish`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            location: userLocation
        })
    })
        .then(response => response.json())
        .then(data => {
            if(data.error) return console.log(data.error);
            window.location.reload();
        });
}

const InfoCard = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
        name: string,
        type: cardType
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

    var btnType: JSX.Element = <></>;

    switch(props.type) {
        default:
        case cardType.Track:
            btnType = <button
                        className={ `${ style.InfocardButton } ${ style.InfocardGreen }` }
                        onClick={ () => track(props.name) }>Start tracking</button>;
            break;
        case cardType.Untrack:
            btnType = <button
                        className={ `${ style.InfocardButton } ${ style.InfocardRed }` }
                        onClick={ () => untrack(props.name) }>Stop tracking</button>;
            break;
        case cardType.Finish:
            btnType = <button
                        className={ `${ style.InfocardButton } ${ style.InfocardGreen }` }
                        onClick={ () => finish(props.name) }>Finish</button>;
            break;
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
                    { btnType }
                </div>
            </div>
        </div>
    );
}

export default InfoCard;