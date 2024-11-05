'use client';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression, } from 'leaflet';
import InfoCard, { cardType } from '@components/infocard';
import React from 'react';
import type { location } from '@logic/types';
import 'leaflet/dist/leaflet.css';

const emptyLocation: location = {
    name: 'N/A',
    location: { lat: 0, lng: 0 },
    description: 'You shouldn\'t be able to read this >:(',
    xp: 0
};

const playerPin = new L.Icon({
    iconUrl: '/icons/userpin.svg',
    iconSize: [ 26, 37 ],
});

const poiPin = new L.Icon({
    iconUrl: '/icons/poipin.svg',
    iconSize: [ 26, 37 ],
});

const Map = (
    { 
        userLocation,
        locations = []
    }: {
        userLocation?: { lat: number, lng: number } | undefined,
        locations?: location[] | undefined
    }
) => {
    console.log("aaa",locations)
    const [ visible,  setVisible  ] = React.useState<boolean>(false);
    const [ location, setLocation ] = React.useState<location>(emptyLocation);

    const center: LatLngExpression = userLocation
        ? [ userLocation.lat, userLocation.lng ]
        : [ 42.143013705260884, 24.749279022216797 ]; // Center of Plovdiv

    return (
        <>
            {
                visible &&
                <InfoCard
                    setter={ setVisible }
                    location={ location }
                    type={ cardType.Finish }
                />
            }
            <MapContainer
                zoomControl={ false }
                center={ center }
                zoom={ 19 }
                scrollWheelZoom={ true }
                style={ { height: '100%', width: '100%' } }
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    userLocation &&
                    <Marker
                        position={ [ userLocation.lat, userLocation.lng ] }
                        icon={ playerPin }
                    ></Marker>
                }
                {
                    locations &&
                    locations.map((location, index) => (
                        <Marker
                            key={ index }
                            position={ [ location.location.lat, location.location.lng ] }
                            icon={ poiPin }
                            eventHandlers={ {
                                click: () => {
                                    setLocation(location);
                                    setVisible(true);
                                }
                            } }                            
                        ></Marker>
                    ))
                }
            </MapContainer>
            <style>
                { /*
                    there will be absolutely no support for either side of any war in this app.
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
    );
};

export default Map;