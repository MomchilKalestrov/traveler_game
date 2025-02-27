'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import JSConfetti from 'js-confetti';

import store, { RootState } from '@logic/redux/store';
import { haversineDistance, findAndReplace } from '@logic/utils';
import { CommunityLandmark, Landmark, User } from '@logic/types';

const patchTopPlayersCache = async (user: User) => {
    let players = JSON.parse(sessionStorage.getItem('top') || '{ "null": true }');
    if (players.null) {
        const top = await fetch('/api/top');
        players = await top.json();
    };
    findAndReplace(players, (p: User) => p.username === user.username, () => user);
    players = players.sort((a: User, b: User) => b.xp - a.xp);
    sessionStorage.setItem('top', JSON.stringify(players));
};

const claim = (coords: GeolocationCoordinates, landmark: Landmark | CommunityLandmark) => {
    const isCommunity = !('dbname' in landmark);

    const name = isCommunity ? `community#${ landmark.name }` : landmark.dbname;

    fetch('/api/visit', {
        method: 'POST',
        body: JSON.stringify({
            name,
            lat: coords.latitude,
            lng: coords.longitude,
        })
    }).then((res) => {
        if (!res.ok) return;

        // some properties are missing in community landmarks
        // that is why we need to fill them in
        // if they DO exist, they will be overwritten by `...landmark`
        const universalLandmark = {
            xp: 10,
            dbname: `community#${ landmark.name }`,
            ...landmark
        };

        store.dispatch({ type: 'landmarksMarkedForVisit/remove', payload: name });
        store.dispatch({ type: 'user/visit', payload: universalLandmark });
        store.dispatch({ type: isCommunity ? 'communityMadeLandmarks/visit' : 'visitedLandmarks/add', payload: landmark });

        const confetti = new JSConfetti();
        confetti.addConfetti({
            confettiColors: [ '#ff0000', '#00ff00', '#0000ff' ],
            confettiRadius: 5,
            confettiNumber: 100
        }).then(() => {
            confetti.destroyCanvas();
            alert(`Congrats on visiting "${ landmark.name }"!`);
            patchTopPlayersCache(store.getState().user.value!);
        });
    });
};

const maxDistance = 50;

const isNear = (coords: GeolocationCoordinates, landmark: Landmark | CommunityLandmark) =>
    haversineDistance(
        coords.latitude, coords.longitude, 
        landmark.location.lat, landmark.location.lng
    ) < maxDistance;

const AutoClaimHook: React.FC = () => {
    const communityMarkedForVisit = useSelector((state: RootState) => state.communityMadeLandmarks.value).markedForVisit;
    const markedForVisit = useSelector((state: RootState) => state.landmarksMarkedForVisit.value);
    
    const autoClaim = ({ coords }: GeolocationPosition) => {
        if (markedForVisit)
            markedForVisit.forEach((landmark) => {
                if (isNear(coords, landmark))
                    claim(coords, landmark);
            });
        if (communityMarkedForVisit)
            communityMarkedForVisit.forEach((landmark) => {
                if (isNear(coords, landmark))
                    claim(coords, landmark);
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
    }, [ markedForVisit?.length, communityMarkedForVisit?.length ]);

    return (<></>);
};

export default AutoClaimHook;