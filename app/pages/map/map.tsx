'use client';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression, } from 'leaflet';
import InfoCard, { cardType } from '@app/components/infocard';
import React from 'react';
import { location } from '@app/logic/types';
import 'leaflet/dist/leaflet.css';

const playerPin = new L.Icon({
    iconUrl: '/icons/userpin.svg',
    iconSize: [ 26, 37 ],
});

const poiPin = new L.Icon({
    iconUrl: '/icons/poipin.svg',
    iconSize: [ 26, 37 ],
});

const HookComponent = () => {
    const map: L.Map = useMap();

    React.useEffect(() => {
        if (map)
            map.invalidateSize();
    });

    return null;
}

const Map = (
    props: {
        zoom?: number,
        userLocation?: { lat: number, lng: number } | undefined,
        locations?: Array<location>,
        reset: () => void
    }
) => {
    const [ visible, setVisible ] = React.useState<boolean>(false);
    const [ name,    setName    ] = React.useState<string | undefined>(undefined);
    const center: LatLngExpression = props.userLocation
        ? [ props.userLocation.lat, props.userLocation.lng ]
        : [ 42.143013705260884, 24.749279022216797 ]; // Center of Plovdiv

    return (
        <>
            {
                visible &&
                <InfoCard
                    setter={ setVisible }
                    name={ name || '' }
                    type={ cardType.Finish }
                    reset={ props.reset }
                />
            }
            <MapContainer
                zoomControl={ false }
                center={ center }
                zoom={ 19 }
                scrollWheelZoom={ true }
                style={ { height: '100%', width: '100%' } }
            >
                <HookComponent />
                
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    props.userLocation &&
                    <Marker
                        position={ [ props.userLocation.lat, props.userLocation.lng ] }
                        icon={ playerPin }
                    ></Marker>
                }
                {
                    props.locations?.map((location, index) => (
                        <Marker
                            key={ index }
                            position={ [ location.location.lat, location.location.lng ] }
                            icon={ poiPin }
                            eventHandlers={ {
                                click: () => {
                                    setVisible(true);
                                    setName(location.name);
                                }
                            } }                            
                        ></Marker>
                    ))
                }
            </MapContainer>
            <style>
                { /*
                    there will be absolutely no support for either side of any wars in this app.
                */ }
                {`
                    .leaflet-attribution-flag {
                        opacity: 0;
                        width: 0;
                        height: 0;  
                    }
                `}
            </style>
        </>
    )
}

export default Map;