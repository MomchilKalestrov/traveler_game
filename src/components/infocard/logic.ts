import { Location } from '@logic/types';
import store from '@logic/redux/store';
import { unixToDate } from '@logic/utils';

import { loading, stopLoading } from '@components/loading';

type ButtonProps = {
    location: Location;
    close: () => void;
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
    
    store.dispatch({ type: 'started/remove', payload: location.dbname });
    store.dispatch({ type: 'new/add',        payload: location });
    store.dispatch({ type: 'user/untrack',   payload: location.dbname });
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
    store.dispatch({ type: 'new/remove',  payload: location.dbname });
    store.dispatch({ type: 'user/track',  payload: location.dbname });
    stopLoading();
    close();
};
    
const filterEntries = (entries: any): any =>
    Object.entries(entries)
        .filter(([ key, value ]) => navigator.canShare({ [ key ]: value }))
        .reduce((acc, [ key, value ]) => ({ ...acc, [ key ]: value }), {});

const share = async ({ location }: ButtonProps) => {
    if (!('share' in navigator)) return;

    const timeOfVisit =
        store.getState()
            .user.value?.finished
            ?.find((l) => l.location === location.dbname)?.time || 0;

    const entries = filterEntries({
        title: 'I visited ' + location.name,
        text: `I visited ${ location.name } on ${ unixToDate(timeOfVisit) }.`,
        url: `${ process.env.APPLICATION_URL }/share?location=${ location.dbname }`
    });
    
    navigator.share(entries);
};

export { untrack, track, share };