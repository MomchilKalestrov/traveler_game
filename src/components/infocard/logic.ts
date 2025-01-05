import { loading, stopLoading } from '@components/loading';
import { Location } from '@logic/types';
import getShareCard from './share';
import store from '@logic/redux/store';

type ButtonProps = {
    location: Location;
    close: () => void;
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
        };
    });
};

const untrack = async ({ location, close }: ButtonProps) => {
    loading();

    const res = await fetch(`/api/untrack`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ name: location.dbname })
    });
    if (!res.ok) {
        alert('An error has occured.');
        return stopLoading();
    };
    
    store.dispatch({ type: 'started/remove', payload: location.name });
    store.dispatch({ type: 'new/add',        payload: location });
    store.dispatch({ type: 'user/untrack',   payload: location.name });
    stopLoading();
    close();
};

const track = async ({ location, close }: ButtonProps) => {
    loading();

    const res = await fetch(`/api/track`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ name: location.dbname })
    })
    if (!res.ok) {
        alert('An error has occured.');
        return stopLoading();
    };
    
    store.dispatch({ type: 'started/add', payload: location });
    store.dispatch({ type: 'new/remove',  payload: location.name });
    store.dispatch({ type: 'user/track',  payload: location.name });
    stopLoading();
    close();
};

const finish = async ({ location, close }: ButtonProps) => {
    const userLocation = await getUserLocation()
    if(!userLocation) return;
        
    loading();

    const res = await fetch(`/api/finish`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            name: location.dbname,
            lat: userLocation.lat,
            lng: userLocation.lng
        })
    });
    if (!res.ok) {
        const data = res.headers.get('Content-Type')?.includes('application/json') && await res.json();
        if(data.error === 'User is not within 100 meters of the location.') {
            alert('You are not within 100 meters of the location.');
            return stopLoading();
        }
        alert('An error has occured.');
        return stopLoading();
    }


    store.dispatch({ type: 'new/remove',     payload: location.name });
    store.dispatch({ type: 'finished/add',   payload: location.name });
    store.dispatch({ type: 'started/remove', payload: location.name });
    store.dispatch({ type: 'user/finish',    payload: location });
    stopLoading();
    close();
};

const toIntentURI = (image: string) => 
    'intent://add-to-story' +
    '#Intent;' +
    'action=com.instagram.share.ADD_TO_STORY;' +
    'type=image/png;' +
    `S.interactive_asset_uri=${ encodeURIComponent(image) };` +
    'S.top_background_color=%239aa396;' +
    'S.bottom_background_color=%23838f7e;' +
    'package=com.instagram.android;' +
    'scheme=https;' +
    `S.browser_fallback_url=${ encodeURIComponent('https://play.google.com/store/apps/details?id=com.instagram.android') };` +
    'end;';

const share = async ({ location }: ButtonProps) => {
    if (!('share' in navigator)) return;

    navigator.share({
        title: 'I visited ' + location.name,
        text: 'I visited ' + location.name + ' on ' + new Date().toLocaleDateString() + '.',
        url: 'https://venturo-game.vercel.app',
    });

    // uncomment this when you finally get an App ID from Facebook
    /*const image = await getShareCard(
        location,
        store.getState()
            .user
            .value
            ?.finished
                .find((l) => l.location === location.name)?.time || 0,
    );

    window.location.href = 'https://www.instagram.com/create/share?text=test';*/
};

export { untrack, track, finish, share };