import { Landmark } from '@logic/types';
import store from '@logic/redux/store';
import { unixToDate } from '@logic/utils';

import { loading, stopLoading } from '@components/loading';

type ButtonProps = {
    landmark: Landmark;
    close: () => void;
};

const unmarkForVisit = async ({ landmark, close }: ButtonProps) => {
    loading();

    const res = await fetch(`/api/unmark-for-visit`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: landmark.dbname })
    });
    if (!res.ok) {
        alert('An error has occured.');
        return stopLoading();
    };
    
    store.dispatch({ type: 'landmarksMarkedForVisit/remove', payload: landmark.dbname });
    store.dispatch({ type: 'newLandmarks/add', payload: landmark });
    store.dispatch({ type: 'user/unmarkForVisit', payload: landmark.dbname });
    stopLoading();
    close();
};

const markForVisit = async ({ landmark, close }: ButtonProps) => {
    loading();

    const res = await fetch(`/api/mark-for-visit`, {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: landmark.dbname })
    })
    if (!res.ok) {
        alert('An error has occured.');
        return stopLoading();
    };
    
    store.dispatch({ type: 'landmarksMarkedForVisit/add', payload: landmark });
    store.dispatch({ type: 'newLandmarks/remove', payload: landmark.dbname });
    store.dispatch({ type: 'user/markForVisit', payload: landmark.dbname });
    stopLoading();
    close();
};
    
const filterEntries = (entries: any): any =>
    Object.entries(entries)
        .filter(([ key, value ]) => navigator.canShare({ [ key ]: value }))
        .reduce((acc, [ key, value ]) => ({ ...acc, [ key ]: value }), {});

const share = async ({ landmark }: ButtonProps) => {
    if (!('share' in navigator)) return;

    const timeOfVisit =
        store.getState()
            .user.value?.visited
            ?.find((l) => l.dbname === landmark.dbname)?.time || 0;

    const entries = filterEntries({
        title: 'I visited ' + landmark.name,
        text: `I visited ${ landmark.name } on ${ unixToDate(timeOfVisit) }.`,
        url: `${ process.env.APPLICATION_URL }/share?landmark=${ landmark.dbname }`
    });
    
    navigator.share(entries);
};

export { unmarkForVisit, markForVisit, share };