'use client';
import {
    fetchAll,
    fetchFinished,
    fetchProfile,
    fetchStarted,
    filterNew
} from '@logic/fetches';
import { toLocation }     from '@logic/types';
import { Location, User } from '@logic/types';
import store              from './store';

type fetchType = [ Location[], Location[], Location[], User ];

const save = (key: string, value: any) =>
    sessionStorage.setItem(key, JSON.stringify(value));

const get = (key: string): any => 
    JSON.parse(sessionStorage.getItem(key) || 'null');

const cast = (object: any): Location[] => 
    Array.isArray(object) ? object.map(toLocation) : [];

const initialSave = async (): Promise<fetchType> => {
    const started  = cast(await fetchStarted());
    const finished = cast(await fetchFinished());
    const all      = cast(await fetchAll());
    const user     = await fetchProfile();

    save('started',     started);
    save('finished',    finished);
    save('all',         all);
    save('user',        user);
    save('initialSave', true);
    
    return [ started, finished, all, (user ? user : {}) as User ];
}

const saveToSessionStorage = (state: any) => {
    for (const key in state)
        save(key, state[key].value);
};

const getFromSessionStorage = async (): Promise<fetchType> => {
    if (!get('initialSave'))
        return await initialSave();
    else return [
        get('started'),
        get('finished'),
        get('all'),
        get('user')
    ];
};

const preloadFromSessionStorage = async (): Promise<void> => {
    const [ started, finished, all, user ] = await getFromSessionStorage();
    store.dispatch({
        type: 'started/update',
        payload: started
    });
    store.dispatch({
        type: 'new/update',
        payload: filterNew(started, finished, all)
    });
    store.dispatch({
        type: 'user/update',
        payload: user
    });
    store.dispatch({
        type: 'all/update',
        payload: all
    });
}

export { saveToSessionStorage, preloadFromSessionStorage };