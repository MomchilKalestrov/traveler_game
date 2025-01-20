import store from '@logic/redux/store';
import { CommunityLocation } from '@logic/types';

const track = async (e: React.MouseEvent<HTMLButtonElement>, location: CommunityLocation) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    target.disabled = true;

    fetch('/api/track', {
        method: 'POST',
        body: JSON.stringify({ name: `community#${ location.name }` })
    }).then((response) => {
        target.disabled = false;
        if (!response.ok) return alert(`Error: ${ response.status } ${ response.statusText }`);
        store.dispatch({ type: 'community/track', payload: location });
    });
};

const untrack = (e: React.MouseEvent<HTMLButtonElement>, location: CommunityLocation) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    target.disabled = true;

    fetch('/api/untrack', {
        method: 'POST',
        body: JSON.stringify({ name: `community#${ location.name }` })
    }).then((response) => {
        target.disabled = false;
        if (!response.ok) return alert(`Error: ${ response.status } ${ response.statusText }`);
        store.dispatch({ type: 'community/untrack', payload: location });
    });
};

const deleteLocation = (e: React.MouseEvent<HTMLButtonElement>, location: CommunityLocation) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    target.disabled = true;

    fetch(`/api/auth/custom-locations?mode=delete&name=${ encodeURIComponent(location.name) }`, {
        method: 'POST'
    }).then((response) => {
        target.disabled = false;
        if (!response.ok) return alert(`Error: ${ response.status } ${ response.statusText }`);
        store.dispatch({ type: 'custom/remove', payload: location.name });
    });
};

const logic: { [ key: string ]: (e: React.MouseEvent<HTMLButtonElement>,location: CommunityLocation) => void } = {
    'track':   track,
    'untrack': untrack,
    'delete':  deleteLocation
};

export { track, untrack, deleteLocation };
export default logic;