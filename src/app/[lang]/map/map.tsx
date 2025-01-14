'use client';
import React from 'react';
import L, { latLng } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet-routing-machine';

import InfoCard     from '@components/infocard';
import { Location } from '@logic/types';

import 'leaflet/dist/leaflet.css';

const emptyLocation: Location = {
    name: '',
    location: { lat: 0, lng: 0 },
    description: '',
    xp: 0,
    dbname: '',
    type: 'misc'
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
};

type HookProps = {
    locations: Location[],
    userLocation?: GeolocationCoordinates | undefined
};

const Hook: React.FC<HookProps> = ({ locations, userLocation }) => {
    const map = useMap();

    const [ routesGenerated, setRoutesGenerated ] = React.useState<boolean>(false);
    const [ centerSet,       setCenterSet       ] = React.useState<boolean>(false);

    const generateRoute = async (
        location: Location,
        userLocation: GeolocationCoordinates,
        router: any
    ) =>
        router.route([
            { latLng: latLng(userLocation.latitude, userLocation.longitude) },
            { latLng: latLng(location.location.lat, location.location.lng) }
        ], (err: any, routes: any) => {
            if (!map || err) return;

            const route = routes[0];
            console.log(route);
            if (!route) return;

            new L.Polyline(route.coordinates, { color: '#224d5c' }).addTo(map);
        });

    const generateRoutes = (locations: Location[], userLocation: GeolocationCoordinates) => {
        if (!map) return;
        const router = new (L as any).Routing.OSRMv1();
        locations.forEach((location) => generateRoute(location, userLocation, router));
    };

    React.useEffect(() => {
        if (!map || !locations || !userLocation || routesGenerated) return;
        generateRoutes(locations, userLocation);
        setRoutesGenerated(true);
    }, [ map, locations, userLocation ]);

    React.useEffect(() => {
        if (!map || !userLocation || centerSet) return;
        map.setView([ userLocation.latitude, userLocation.longitude ], 10);
        setCenterSet(true);
    }, [ map, userLocation ]);

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
                    icon={ playerPin }
                    position={ [
                        userLocation.coords.latitude,
                        userLocation.coords.longitude
                    ] }
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
                <Hook locations={ locations } userLocation={ userLocation?.coords } />
            </MapContainer>
            <style>
            {
                /* there will be absolutely no support for either side of any war in this app.
                I checked, and the ukranian flag is not required by the license. */
                `.leaflet-attribution-flag {
                    opacity: 0;
                    width: 0;
                    height: 0;  
                }

                .leaflet-routing-container {
                    display: none;
                }`
            }
            </style>
        </>
    );
};

export default Map;