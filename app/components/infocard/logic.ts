import { loading, stopLoading } from '@components/loading';
import JSConfetti from 'js-confetti';

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
        }
    });
};

const untrack = (
    name: string,
    reset: () => void,
    close: () => void
) => {
    loading();
    fetch(`/api/untrack`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ name: name })
    })
        .then(response => {
            if (!response.ok)
                return alert('An error has occured.');
            close();
            reset();
        });
}

const track = (
    name: string,
    reset: () => void,
    close: () => void
) => {
    loading();
    fetch(`/api/track`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ name: name })
    })
        .then(response => {
            if (!response.ok)
                return alert('An error has occured.');
            close();
            reset();
        });
}

const finish = (
    name: string,
    reset: () => void,
    close: () => void

) => {
    getUserLocation().then(location => {
        if(!location) return;
        
        loading();
        fetch(`/api/finish`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                location: location
            })
        })
            .then(response => response.json())
            .then(data => {
                if(data.error === 'User is not within 100 meters of the location.') {
                    alert('You are not within 100 meters of the location.');
                    return stopLoading();
                }
                else if(data.error) {
                    alert('An error has occured:\n' + data.error);
                    return stopLoading();
                }
                close();
                reset();
                new JSConfetti().addConfetti();
            });
    });
}

export { untrack, track, finish };