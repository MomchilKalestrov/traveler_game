import { loading, stopLoading } from '@components/loading';
import { Location } from '@logic/types';
import store        from '@logic/redux/store';

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

const share = async ({ location }: ButtonProps) => {
    if (!navigator.share)
        return alert('Your browser does not support sharing.');

    navigator.share({
        title: location.name,
        text: `I've just visited ${ location.name } in Venturo!`,
        url: '/home'
    });
};

export { untrack, track, finish, share };