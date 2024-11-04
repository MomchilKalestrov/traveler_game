'use client';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression, } from 'leaflet';
import InfoCard, { cardType } from '@app/components/infocard';
import React, { useRef } from 'react';
import type { location } from '@app/logic/types';
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
const Hook = () => {
    const map = useMap();

    const revalidate = () => {
        if (((map as any)._container as HTMLDivElement).parentElement?.style.display !== 'none')
            map.invalidateSize();
        setTimeout(revalidate, 500);
    }

    React.useEffect(() => {
        revalidate();
    }, [ map ]);

    return null;
}

const Map = (
    props: {
        zoom?: number,
        userLocation?: { lat: number, lng: number } | undefined,
        locations?: Array<location>
    }
) => {
    const [ visible,  setVisible  ] = React.useState<boolean>(false);
    const [ location, setLocation ] = React.useState<location>(emptyLocation);

    const center: LatLngExpression = props.userLocation
        ? [ props.userLocation.lat, props.userLocation.lng ]
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
                <Hook />
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