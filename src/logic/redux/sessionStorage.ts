'use client';
import { Dispatch } from 'redux';

import {
    fetchAll,
    fetchFinished,
    fetchProfile,
    fetchStarted,
    filterNew
} from '@logic/fetches';
import { toLocation }          from '@logic/types';
import type { location, user } from '@logic/types';

import { updateNew }        from '@logic/redux/newSlice';
import { updateUser }       from '@logic/redux/userSlice';
import { updateStarted }    from '@logic/redux/startedSlice';
import type { AppDispatch } from '@logic/redux/store';

type fetchType = [ location[], location[], location[], user ]

const save = (key: string, value: any) =>
    sessionStorage.setItem(key, JSON.stringify(value));

const get = (key: string): any => 
    JSON.parse(sessionStorage.getItem(key) || 'null');

const cast = (object: any): location[] => 
    Array.isArray(object) ? object.map(toLocation) : [];

const initialSave = async (): Promise<fetchType> => {    
    const started = cast(await fetchStarted());
    const finished = cast(await fetchFinished());
    const all = cast(await fetchAll());
    const user = await fetchProfile();
    console.log(user);

    save('started',     started);
    save('finished',    finished);
    save('all',         all);
    save('user',        user);
    save('initialSave', true);
    
    return [ started, finished, all, (user ? user : {}) as user ];
}

const saveToSessionStorage = (state: any) => {
    for (const key in state)
        save(key, state[key]);
};

const getFromSessionStorage = async (): Promise<fetchType> => {
    if (!get('initialSave'))
        return await initialSave();
    else 
        return [
            get('started'),
            get('finished'),
            get('all'),
            get('user')
        ];
};

const preloadFromSessionStorage = async (dispatch: AppDispatch): Promise<void> => {
    const [ s, f, a, u ] = await getFromSessionStorage();
    dispatch({
        type: 'started/updateStarted',
        payload: s
    });
    dispatch({
        type: 'new/updateNew',
        payload: filterNew(s, f, a)
    });
    dispatch({
        type: 'user/updateUser',
        payload: u
    });
}

export { saveToSessionStorage, preloadFromSessionStorage };