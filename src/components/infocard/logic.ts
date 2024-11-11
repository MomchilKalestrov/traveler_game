import { loading, stopLoading } from '@components/loading';
import store from '@logic/redux/store';

type ButtonProps = {
    name: string;
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

const untrack = async ({ name, close }: ButtonProps) => {
    loading();

    const res = await fetch(`/api/untrack`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ name: name })
    });
    if (!res.ok) {
        alert('An error has occured.');
        return stopLoading();
    };

    const location = await fetch(`/api/location?name=${ name }`);
    if (!location.ok) {
        alert('An error has occured.');
        return stopLoading();
    };
    
    store.dispatch({ type: 'started/remove', payload: name });
    store.dispatch({ type: 'new/add',        payload: await location.json() });
    store.dispatch({ type: 'user/untrack',   payload: name });
    stopLoading();
    close();
};

const track = async ({ name, close }: ButtonProps) => {
    loading();

    const res = await fetch(`/api/track`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ name: name })
    })
    if (!res.ok) {
        alert('An error has occured.');
        return stopLoading();
    };

    const location = await fetch(`/api/location?name=${ name }`);
    if (!location.ok) {
        alert('An error has occured.');
        return stopLoading();
    };
    
    store.dispatch({ type: 'started/add', payload: await location.json() });
    store.dispatch({ type: 'new/remove',  payload: name });
    store.dispatch({ type: 'user/track',  payload: name });
    stopLoading();
    close();
};

const finish = async ({ name, close }: ButtonProps) => {
    const userLocation = await getUserLocation()
    if(!userLocation) return;
        
    loading();

    const res = await fetch(`/api/finish`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            name: name,
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

    store.dispatch({ type: 'new/remove',     payload: name });
    store.dispatch({ type: 'finished/add',   payload: name });
    store.dispatch({ type: 'started/remove', payload: name });
    store.dispatch({ type: 'user/finish',    payload: name });
    stopLoading();
    close();
};

export { untrack, track, finish };