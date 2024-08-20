import style from './infocard.module.css';
import { useRouter } from "next/navigation";
import React from "react";
import { loading, stopLoading } from '@components/loading/loading';

export enum cardType {
    Untrack,
    Track,
    Finish
};

const getUserLocation = (): Promise<{ lat: number, lng: number } | undefined> => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(userLocation);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    reject(undefined);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
            reject(undefined);
        }
    });
};

const untrack = (
    name: string,
    reset: () => void,
    close: () => void
) => {
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
            if(data.error) {
                alert('An error has occured:\n' + data.error);
                return stopLoading();
            }
            close();
            reset();
        });
}

const track = (
    name: string,
    reset: () => void,
    close: () => void
) => {
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
            if(data.error) {
                alert('An error has occured:\n' + data.error);
                return stopLoading();
            }
            close();
            reset();
        });
}

const finish = (
    name: string,
    reset: () => void,
    close: () => void

) => {
    getUserLocation().then(location => {
        if(!location) return;

        loading();
        fetch(`/api/finish`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                location: location
            })
        })
            .then(response => response.json())
            .then(data => {
                if(data.error === 'User is not within 100 meters of the location.') {
                    alert('You are not within 100 meters of the location.');
                    return stopLoading();
                }
                else if(data.error) {
                    alert('An error has occured:\n' + data.error);
                    return stopLoading();
                }
                close();
                reset();
            });
    });
}

const InfoCard = (
    props: {
        setter: React.Dispatch<React.SetStateAction<boolean>>
        name: string,
        type: cardType,
        reset: () => void
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
            btnType =
                <button
                    className={ `${ style.InfocardButton } ${ style.InfocardGreen }` }
                    onClick={ () => track(props.name, props.reset, close) }
                >Start tracking</button>;
            break;
        case cardType.Untrack:
            btnType =
                <button
                    className={ `${ style.InfocardButton } ${ style.InfocardRed }` }
                    onClick={ () => untrack(props.name, props.reset, close) }
                >Stop tracking</button>;
            break;
        case cardType.Finish:
            btnType =
                <button
                    className={ `${ style.InfocardButton } ${ style.InfocardGreen }` }
                    onClick={ () => finish(props.name, props.reset, close) }
                >Finish</button>;
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