'use client';
import React from 'react';
import { useSelector } from 'react-redux';

import store, { RootState } from '@logic/redux/store';
import { haversineDistance } from '@logic/utils';
import { CommunityLocation, Location } from '@src/logic/types';

const claim = (coords: GeolocationCoordinates, location: Location | CommunityLocation) => {
    console.log('Claiming: ', location);
    const isCommunity = !('dbname' in location);

    const name = isCommunity ? `community#${ location.name }` : location.dbname;

    fetch('/api/finish', {
        method: 'POST',
        body: JSON.stringify({
            name,
            lat: coords.latitude,
            lng: coords.longitude,
        })
    }).then((res) => {
        if (!res.ok) return;

        // some properties are missing in community locations
        // that is why we need to fill them in
        // if they DO exist, they will be overwritten by `...location`
        const universalLocation = {
            xp: 10,
            dbname: `community#${ location.name }`,
            ...location
        };

        store.dispatch({ type: 'started/remove', payload: name });
        store.dispatch({ type: 'user/finish', payload: universalLocation });
        store.dispatch({ type: isCommunity ? 'community/finish' : 'finished/add', payload: location });
    });
};

const isNear = (coords: GeolocationCoordinates, location: Location | CommunityLocation) =>
    haversineDistance(
        coords.latitude, coords.longitude, 
        location.location.lat, location.location.lng
    ) < maxDistance;

const maxDistance = 50;

const AutoClaimHook: React.FC = () => {
    const community = useSelector((state: RootState) => state.community.value).started;
    const started   = useSelector((state: RootState) => state.started.value);
    
    const autoClaim = ({ coords }: GeolocationPosition) => {
        if (started)
            started.forEach((location) => {
                if (isNear(coords, location))
                    claim(coords, location);
            });
        if (community)
            community.forEach((location) => {
                if (isNear(coords, location))
                    claim(coords, location);
            });
    };

    React.useEffect(() => {
        if (!navigator.geolocation) return;

        const id = navigator.geolocation.watchPosition(
            autoClaim,
            console.error,
            {
                enableHighAccuracy: true,
                timeout: 5000,
            }
        );

        return () => navigator.geolocation.clearWatch(id);
    }, [ started, community ]);

    return (<></>);
};

export default AutoClaimHook;