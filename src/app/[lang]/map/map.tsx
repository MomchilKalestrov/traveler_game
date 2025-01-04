'use client';
import React from 'react';
import L     from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';

import InfoCard, { cardType } from '@components/infocard';
import { Location }           from '@logic/types';

import 'leaflet/dist/leaflet.css';

const emptyLocation: Location = {
    name: '',
    location: { lat: 0, lng: 0 },
    description: '',
    xp: 0,
    dbname: ''
};

const playerPin = new L.Icon({
    iconUrl: '/icons/userpin.svg',
    iconSize: [ 26, 37 ],
});

const poiPin = new L.Icon({
    iconUrl: '/icons/poipin.svg',
    iconSize: [ 26, 37 ],
});

type MapProps = {
    locations?: Location[] | undefined,
    hasGPSAccess: boolean
}

const Hook: React.FC = () => {
    const map = useMap();

    const setCenter = (position: GeolocationPosition) =>
        map.setView([
            position.coords.latitude,
            position.coords.longitude
        ], 15);

    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            setCenter,
            (error) => console.log('Error getting user location: \n', error),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
    }, []);

    return null;
}

const Map: React.FC<MapProps> = ({ locations = [], hasGPSAccess }) => {
    const [ visible,  setVisible  ] = React.useState<boolean>(false);
    const [ location, setLocation ] = React.useState<Location>(emptyLocation);
    
    const [ userLocation, setUserLocation ] = React.useState<GeolocationPosition | undefined>(undefined);

    React.useEffect(() => {
        if (!hasGPSAccess) return;
        if (!navigator.geolocation) return alert('Geolocation is not supported by this browser.');
        
        const id = navigator.geolocation.watchPosition(
            setUserLocation,
            (error) => console.log('Error getting user location: \n', error),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(id);
    }, []);
    
    return (
        <>
        {
            visible &&
            <InfoCard
                setter={ setVisible }
                location={ location }
                type='finish'
            />
        }
            <MapContainer
                zoomControl={ false }
                center={ [ 42.143013705260884, 24.749279022216797 ] }
                zoom={ 10 }
                scrollWheelZoom={ true }
                style={ { height: '100%', width: '100%' } }
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            {
                (userLocation && userLocation.coords) &&
                <Marker
                    position={ [
                        userLocation.coords.latitude,
                        userLocation.coords.longitude
                    ] }
                    icon={ playerPin }
                />
            }
            {
                locations.map((poi, index) => (
                    <Marker
                        key={ index }
                        position={ [ poi.location.lat, poi.location.lng ] }
                        icon={ poiPin }
                        eventHandlers={ {
                            click: () => {
                                setLocation(poi);
                                setVisible(true);
                            }
                        } }
                    />
                ))
            }
            <Hook />
            </MapContainer>
            <style>
            { /*
            there will be absolutely no support for either side of any war in this app.
            I checked, and the ukranian flag is not required by the license.
            */ }
            { `
                .leaflet-attribution-flag {
                    opacity: 0;
                    width: 0;
                    height: 0;  
                }
            ` }
            </style>
        </>
    );
};

export default Map;