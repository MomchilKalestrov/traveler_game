import React from 'react';
import Image from 'next/image';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { CommunityLocation } from '@logic/types';
import logic from './logic';

import Button from '@components/button';

import style from './communityCard.module.css';
import LoadingPlaceholder from '@src/components/loading';
import LanguageCTX from '@src/logic/contexts/languageCTX';

type CommunityCardProps = {
    location: CommunityLocation;
    type: 'track' | 'untrack' | 'delete';
};

type MapProps = {
    lat: number;
    lng: number;
};

type InteractiveMapProps = {
    lat: number;
    lng: number;
    zoom: number;
    dispose: () => void;
}

const locationToTile = (lat: number, lng: number, zoom: number): [ number, number ] => {
    const x = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

    return [ x, y ];
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lng, zoom, dispose }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!ref.current) return;

        const map = L.map(ref.current, { zoomControl: false })
                .setView([ lat, lng ], zoom)
                .addLayer(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));

        map
            .attributionControl
            .setPrefix('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
        
        const disposeButton = L.Control.extend({
            options: { position: 'topright' },
            onAdd: () => {
                const button = L.DomUtil.create('button', style.MapButton);
                button.innerHTML = `
                    <img
                        src="/icons/close.svg" width="24" height="24"
                        alt="✖" style="filter: brightness(0) invert(1);"
                    />`;
                button.onclick = () => dispose();

                return button;
            }
        });

        L.marker([ lat, lng ], {
            icon: L.icon({
                iconUrl: '/icons/communitypin.svg',
                iconSize: [ 32, 32 ],
                iconAnchor: [ 16, 16 ]
            })
        }).addTo(map);

        const button = new disposeButton();
        map.addControl(button);

        return () => {
            map.removeControl(button);
            map.remove();
        };
    }, [ ref ]);

    return (<div style={ { width: '100%', height: '100%' } } ref={ ref }></div>);
};

const Map: React.FC<MapProps> = ({ lat, lng }) => {
    const [ isInteractive, setInteractive ] = React.useState(false);
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    
    const zoom = 15;
    const [ x, y ] = locationToTile(lat, lng, zoom);
    const map: JSX.Element[] = React.useMemo<JSX.Element[]>(() => {
        const map = [];
        for (let tileX: number = x - 1; tileX <= x + 1; tileX++)
            for (let tileY: number = y - 1; tileY <= y + 1; tileY++)
                map.push(
                    <Image
                        alt='Tile' width={ 256 } height={ 256 } key={ `${ tileX }-${ tileY }` } loading='lazy'
                        src={ `https://tile.openstreetmap.org/${ zoom }/${ tileX }/${ tileY }.png` }
                    />
                );
        return map;
    }, [ x, y ]);

    const openInteractiveMap = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (mapContainerRef.current)
            mapContainerRef.current.style.height = '14.5rem';

        setTimeout(() => setInteractive(true), 500);
    };

    const closeInteractiveMap = () => {
        if (mapContainerRef.current)
            mapContainerRef.current.style.height = '10rem';

        setTimeout(() => setInteractive(false), 500);
    };
    
    return (
        <div className={ style.MapContainer } ref={ mapContainerRef }>
        {
            isInteractive
            ?   <InteractiveMap lat={ lat } lng={ lng } dispose={ closeInteractiveMap } zoom={ zoom } />
            :   <div className={ style.Map }>
                    { map }
                    <button
                        onClick={ openInteractiveMap }
                        className={ style.MapButton }
                        style={ {
                            position: 'absolute',
                            top: '0px',
                            right: '0px'
                        } }
                    ><Image src='/icons/expand.svg' alt='⛶' width={ 24 } height={ 25 } /></button>
                </div>
        }
        </div>
    );
};

const CommunityCard: React.FC<CommunityCardProps> = ({ location, type }) => {
    const language = React.useContext(LanguageCTX);

    if (!language) return (<LoadingPlaceholder />);

    return (
        <div className={ style.Card }>
            <Map lat={ location.location.lat } lng={ location.location.lng } />
            <div className={ style.Content }>
                <div>
                    <h3>{ location.name }</h3>
                    <p>{ location.author }</p>
                </div>
                <div style={ { display: 'flex', gap: '0.5rem' } }>
                    <Button border={ true } onClick={ e => logic[ type ](e, location) }>
                        { language.community.buttons[ type ] }
                    </Button>
                </div>
            </div>
        </div>
    )
};

export default CommunityCard;